<?php

namespace App\Console\Commands;

use App\Models\FilterGroup;
use App\Models\FilterValue;
use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class MigrateProductFilters extends Command
{
    protected $signature = 'tagq:migrate-product-filters {--dry-run : Show what would be done without actually inserting}';

    protected $description = 'Migrate existing gender, movement and specs data to product_filter_value pivot table';

    private array $genderMap = [
        'male' => 'masculino',
        'female' => 'femenino',
        'unisex' => 'unisex',
    ];

    private array $movementMap = [
        'cuarzo' => 'cuarzo',
        'cuarzo digital' => 'cuarzo',
        'automático' => 'automatico',
        'eco-drive' => 'eco-drive',
        'smartwatch' => 'smartwatch',
        'digital' => 'digital',
    ];

    private array $specsGroupMap = [
        'estilo' => 'estilo',
        'tipo_reloj' => 'tipo-reloj',
        'correa_material' => 'material-correa',
        'material_correa' => 'material-correa',
        'correa_color' => 'color-correa',
        'color_correa' => 'color-correa',
        'tamano_caja' => 'tamano-caja',
        'resistencia_agua' => 'resistencia-agua',
        'funciones' => 'funciones',
        'color_esfera' => 'color-esfera',
        'forma_caja' => 'forma-caja',
    ];

    // Fallback mappings for values that don't match by slug
    private array $valueAliases = [
        'tamano-caja' => [
            '32' => '36-39-mm',
            '33' => '36-39-mm',
            '34' => '36-39-mm',
            '35' => '36-39-mm',
            '36' => '36-39-mm',
            '37' => '36-39-mm',
            '38' => '36-39-mm',
            '39' => '36-39-mm',
            '40' => '40-42-mm',
            '41' => '40-42-mm',
            '42' => '40-42-mm',
            '43' => '43-mm-o-mas',
            '44' => '43-mm-o-mas',
            '45' => '43-mm-o-mas',
            '46' => '43-mm-o-mas',
            '47' => '43-mm-o-mas',
            '48' => '43-mm-o-mas',
        ],
        'material-correa' => [
            'resina' => 'silicona',
            'lona' => 'telanylon',
            'malla' => 'acero-inoxidable',
            'malla-de-acero' => 'acero-inoxidable',
        ],
        'color-correa' => [
            'gris' => 'plateado',
            'dorado-rosado' => 'dorado',
        ],
        'color-esfera' => [
            'rosado' => 'rojo',
            'turquesa' => 'azul',
            'crema' => 'blanco',
        ],
        'resistencia-agua' => [
            '50' => '5-atm',
            '100' => '10-atm',
            '200' => '20-atm',
            '30' => '3-atm',
        ],
        'funciones' => [
            'mundial' => 'gmt',
            'carga-solar' => 'fecha',
            'visualizacion-de-carga' => 'fecha',
            'calendario' => 'fecha',
            'luz-indiglo' => 'luz-led',
            'wear-os' => 'bluetooth',
            'gps' => 'bluetooth',
            'ritmo-cardiaco' => 'bluetooth',
            'nfc' => 'bluetooth',
            'visualizacion-de-cuerda' => 'fecha',
            'visualizacion-trasera' => 'fecha',
            'dia' => 'fecha',
            'taquimetro' => 'cronografo',
        ],
        'estilo' => [
            'ejecutivo' => 'elegante',
            'moderno' => 'casual',
            'clasico' => 'elegante',
            'aventurero' => 'deportivo',
            'retro' => 'casual',
            'tecnologico' => 'deportivo',
            'minimalista' => 'elegante',
            'deportivo-elegante' => 'deportivo',
            'casual' => 'casual',
        ],
        'tipo-reloj' => [
            'automatico' => 'analogico',
        ],
        'forma-caja' => [
            'octagonal' => 'redonda',
        ],
    ];

    public function handle(): int
    {
        $dryRun = $this->option('dry-run');
        $totalInserted = 0;
        $totalCreated = 0;
        $errors = [];

        $allValues = FilterValue::with('group')->get();
        $valuesByGroup = [];
        foreach ($allValues as $val) {
            $groupSlug = $val->group->slug;
            $valuesByGroup[$groupSlug][$val->slug] = $val;
        }

        $products = Product::with('filterValues')->get();
        $bar = $this->output->createProgressBar($products->count());
        $bar->start();

        foreach ($products as $product) {
            $existingIds = $product->filterValues->pluck('id')->toArray();
            $newIds = [];

            // 1. Gender
            if (!empty($product->gender)) {
                $slug = $this->genderMap[strtolower($product->gender)] ?? null;
                if ($slug && isset($valuesByGroup['genero'][$slug])) {
                    $newIds[] = $valuesByGroup['genero'][$slug]->id;
                }
            }

            // 2. Movement
            if (!empty($product->movement)) {
                $key = strtolower(trim($product->movement));
                $slug = $this->movementMap[$key] ?? Str::slug($key);
                if (isset($valuesByGroup['movimiento'][$slug])) {
                    $newIds[] = $valuesByGroup['movimiento'][$slug]->id;
                }
            }

            // 3. Specs
            if (!empty($product->specs)) {
                foreach ($product->specs as $key => $value) {
                    if (empty($value)) continue;

                    $groupSlug = $this->specsGroupMap[$key] ?? null;
                    if (!$groupSlug) continue;

                    $parts = preg_split('/[,\/]/', $value);
                    foreach ($parts as $part) {
                        $part = trim($part);
                        if (empty($part)) continue;

                        $matched = $this->resolveValue($valuesByGroup, $groupSlug, $part, $dryRun);
                        if ($matched !== null) {
                            $newIds[] = $matched['id'];
                            if ($matched['created']) $totalCreated++;
                        } else {
                            $errors[] = "Product {$product->id}: specs.{$key}='{$part}' not mapped in group '{$groupSlug}'";
                        }
                    }
                }
            }

            $newIds = array_unique(array_diff($newIds, $existingIds));

            if (!empty($newIds)) {
                if (!$dryRun) {
                    $product->filterValues()->attach($newIds);
                }
                $totalInserted += count($newIds);
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("Products processed: {$products->count()}");
        $this->info("Filter values inserted: {$totalInserted}");
        if ($totalCreated > 0) {
            $this->info("New filter values auto-created: {$totalCreated}");
        }

        if (!empty($errors)) {
            $this->warn('Still unmapped (' . count($errors) . '):');
            foreach (array_slice(array_unique($errors), 0, 20) as $error) {
                $this->line("  {$error}");
            }
            if (count(array_unique($errors)) > 20) {
                $this->line('  ... and ' . (count(array_unique($errors)) - 20) . ' more');
            }
        }

        if ($dryRun) {
            $this->info('Dry-run mode — no data was inserted.');
        }

        return Command::SUCCESS;
    }

    private function resolveValue(array &$valuesByGroup, string $groupSlug, string $part, bool $dryRun): ?array
    {
        if (!isset($valuesByGroup[$groupSlug])) return null;
        $groupValues = &$valuesByGroup[$groupSlug];

        $slug = Str::slug($part);

        // 1. Exact slug match
        if (isset($groupValues[$slug])) {
            return ['id' => $groupValues[$slug]->id, 'created' => false];
        }

        // 2. Size range match (for tamano-caja)
        if (in_array($groupSlug, ['tamano-caja', 'resistencia-agua'])) {
            // Extract integer part only
            preg_match('/\d+/', $part, $m);
            $num = $m[0] ?? null;
            if ($num) {
                $numKey = $num;
                if (isset($this->valueAliases[$groupSlug][$numKey])) {
                    $aliasSlug = $this->valueAliases[$groupSlug][$numKey];
                    if (isset($groupValues[$aliasSlug])) {
                        return ['id' => $groupValues[$aliasSlug]->id, 'created' => false];
                    }
                }
            }
        }

        // 3. Alias match
        if (isset($this->valueAliases[$groupSlug][$slug])) {
            $aliasSlug = $this->valueAliases[$groupSlug][$slug];
            if (isset($groupValues[$aliasSlug])) {
                return ['id' => $groupValues[$aliasSlug]->id, 'created' => false];
            }
        }

        // 4. Contains match (e.g., "5 ATM (50m)" matches "5-atm")
        foreach ($groupValues as $fslug => $fv) {
            $cleanPart = str_replace(['-', '_'], '', $slug);
            $cleanVal = str_replace(['-', '_'], '', $fslug);
            if (str_contains($cleanPart, $cleanVal) || str_contains($cleanVal, $cleanPart)) {
                return ['id' => $fv->id, 'created' => false];
            }
        }

        // 5. Auto-create the value in the group
        if (!$dryRun) {
            $group = FilterGroup::where('slug', $groupSlug)->first();
            if ($group) {
                $fv = FilterValue::firstOrCreate(
                    ['filter_group_id' => $group->id, 'slug' => $slug],
                    [
                        'value' => $part,
                        'sort_order' => FilterValue::where('filter_group_id', $group->id)->max('sort_order') + 1,
                    ]
                );
                $valuesByGroup[$groupSlug][$slug] = $fv;
                return ['id' => $fv->id, 'created' => true];
            }
        }

        return null;
    }
}
