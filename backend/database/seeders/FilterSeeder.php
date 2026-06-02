<?php

namespace Database\Seeders;

use App\Models\FilterGroup;
use App\Models\FilterValue;
use Illuminate\Database\Seeder;

class FilterSeeder extends Seeder
{
    public function run(): void
    {
        $groups = [
            [
                'name' => 'Género',
                'slug' => 'genero',
                'display_type' => 'radio',
                'sort_order' => 1,
                'values' => ['Masculino', 'Femenino', 'Unisex'],
            ],
            [
                'name' => 'Movimiento',
                'slug' => 'movimiento',
                'display_type' => 'checkbox',
                'sort_order' => 2,
                'values' => ['Cuarzo', 'Automático', 'Solar', 'Eco-Drive', 'Smartwatch', 'Digital'],
            ],
            [
                'name' => 'Estilo',
                'slug' => 'estilo',
                'display_type' => 'checkbox',
                'sort_order' => 3,
                'values' => ['Casual', 'Deportivo', 'Elegante', 'Lujo'],
            ],
            [
                'name' => 'Tipo de reloj',
                'slug' => 'tipo-reloj',
                'display_type' => 'checkbox',
                'sort_order' => 4,
                'values' => ['Analógico', 'Digital', 'Smartwatch'],
            ],
            [
                'name' => 'Material de la correa',
                'slug' => 'material-correa',
                'display_type' => 'checkbox',
                'sort_order' => 5,
                'values' => ['Acero inoxidable', 'Cuero', 'Silicona', 'Tela/Nylon', 'Plástico', 'Cerámica'],
            ],
            [
                'name' => 'Color de correa',
                'slug' => 'color-correa',
                'display_type' => 'checkbox',
                'sort_order' => 6,
                'values' => ['Negro', 'Marrón', 'Plateado', 'Dorado', 'Azul', 'Rojo', 'Verde', 'Blanco'],
            ],
            [
                'name' => 'Tamaño de la caja',
                'slug' => 'tamano-caja',
                'display_type' => 'checkbox',
                'sort_order' => 7,
                'values' => ['36–39 mm', '40–42 mm', '43 mm o más'],
            ],
            [
                'name' => 'Resistencia al agua',
                'slug' => 'resistencia-agua',
                'display_type' => 'checkbox',
                'sort_order' => 8,
                'values' => ['3 ATM', '5 ATM', '10 ATM', '20 ATM'],
            ],
            [
                'name' => 'Funciones',
                'slug' => 'funciones',
                'display_type' => 'checkbox',
                'sort_order' => 9,
                'values' => ['Cronógrafo', 'Fecha', 'GMT', 'Fase lunar', 'Cronómetro', 'Alarma', 'Luz LED', 'Bluetooth'],
            ],
            [
                'name' => 'Color de la esfera',
                'slug' => 'color-esfera',
                'display_type' => 'checkbox',
                'sort_order' => 10,
                'values' => ['Negro', 'Blanco', 'Azul', 'Plateado', 'Dorado', 'Verde', 'Rojo'],
            ],
            [
                'name' => 'Forma de la caja',
                'slug' => 'forma-caja',
                'display_type' => 'checkbox',
                'sort_order' => 11,
                'values' => ['Redonda', 'Cuadrada', 'Rectangular', 'Hexagonal', 'Tono'],
            ],
        ];

        foreach ($groups as $groupData) {
            $values = $groupData['values'];
            unset($groupData['values']);

            $group = FilterGroup::firstOrCreate(
                ['slug' => $groupData['slug']],
                $groupData
            );

            foreach ($values as $i => $val) {
                FilterValue::firstOrCreate(
                    ['filter_group_id' => $group->id, 'slug' => \Illuminate\Support\Str::slug($val)],
                    ['value' => $val, 'sort_order' => $i + 1]
                );
            }
        }

        $this->command->info('Filter groups and values seeded successfully.');
    }
}
