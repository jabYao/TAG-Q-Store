<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        Setting::setValue('envio_gratis_minimo', 400000, 'number');
        Setting::setValue('whatsapp_contacto', '573001234567', 'text');
        Setting::setValue('tienda_nombre', 'TAG-Q', 'text');
        Setting::setValue('contraentrega_habilitada', true, 'boolean');
        Setting::setValue('impuesto_porcentaje', 19, 'number');
    }
}
