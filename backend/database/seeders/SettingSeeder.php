<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        Setting::setValue('envio_gratis_minimo', 400000, 'number');
        Setting::setValue('whatsapp_contacto', '573152429172', 'text');
        Setting::setValue('top_bar_messages', [
            ['icon' => '🚚', 'text' => 'ENVÍO GRATIS EN PEDIDOS SOBRE $400.000'],
            ['icon' => '💳', 'text' => 'PAGO SEGURO CON WOMPI'],
            ['icon' => '📞', 'text' => '24/7 SOPORTE WHATSAPP'],
            ['icon' => '↩️', 'text' => 'DEVOLUCIONES GRATIS EN 30 DÍAS'],
        ], 'json');
        Setting::setValue('tienda_nombre', 'TAG-Q', 'text');
        Setting::setValue('contraentrega_habilitada', true, 'boolean');
        Setting::setValue('impuesto_porcentaje', 19, 'number');
    }
}
