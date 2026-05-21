<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'type',
    ];

    public static function getValue(string $key, mixed $default = null): mixed
    {
        return Cache::remember("setting.{$key}", 86400, function () use ($key, $default) {
            $setting = static::where('key', $key)->first();

            if (! $setting) {
                return $default;
            }

            return match ($setting->type) {
                'boolean' => filter_var($setting->value, FILTER_VALIDATE_BOOLEAN),
                'number' => is_numeric($setting->value) ? ($setting->value + 0) : $setting->value,
                'json' => json_decode($setting->value, true),
                default => $setting->value,
            };
        });
    }

    public static function setValue(string $key, mixed $value, string $type = 'text'): void
    {
        $stringValue = match ($type) {
            'boolean' => $value ? 'true' : 'false',
            'json' => json_encode($value, JSON_UNESCAPED_UNICODE),
            default => (string) $value,
        };

        static::updateOrCreate(
            ['key' => $key],
            ['value' => $stringValue, 'type' => $type]
        );

        Cache::forget("setting.{$key}");
    }

    /**
     * Limpiar toda la caché de settings (útil después de seeders o migraciones).
     */
    public static function clearCache(): void
    {
        Cache::forget('setting.envio_gratis_minimo');
    }
}
