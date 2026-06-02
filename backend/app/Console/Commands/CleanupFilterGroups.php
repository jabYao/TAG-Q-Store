<?php

namespace App\Console\Commands;

use App\Models\FilterGroup;
use Illuminate\Console\Command;

class CleanupFilterGroups extends Command
{
    protected $signature = 'tagq:cleanup-filters';

    protected $description = 'Remove filter groups that are not in the mandatory list (Estilo, Material, Color correa, Tamaño, Resistencia, Color esfera, Forma)';

    private array $slugsToKeep = [
        'genero',
        'movimiento',
        'tipo-reloj',
        'funciones',
    ];

    public function handle(): int
    {
        $removed = 0;

        foreach (FilterGroup::all() as $group) {
            if (in_array($group->slug, $this->slugsToKeep)) {
                $this->line("  Keeping: {$group->name}");
                continue;
            }

            $this->warn("  Removing: {$group->name} ({$group->slug})");
            $group->delete(); // Cascade deletes values + pivot entries
            $removed++;
        }

        $this->info("Done. {$removed} filter groups removed.");
        $this->line('Remaining groups: ' . FilterGroup::count());

        return Command::SUCCESS;
    }
}
