<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    /**
     * Enviar mensaje de contacto (público).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'subject' => 'nullable|string|max:100',
            'message' => 'required|string|max:5000',
        ]);

        $message = ContactMessage::create($validated);

        // Notificar por email via Resend
        try {
            $adminEmail = config('mail.from.address');
            $appName = config('app.name', 'TAG-Q');

            $phone = $validated['phone'] ?? '—';
            $subject = $validated['subject'] ?? '—';

            Mail::raw(
                "Nuevo mensaje de contacto - {$appName}\n\n" .
                "Nombre: {$validated['name']}\n" .
                "Email: {$validated['email']}\n" .
                "Teléfono: {$phone}\n" .
                "Asunto: {$subject}\n\n" .
                "Mensaje:\n{$validated['message']}",
                function ($mail) use ($adminEmail, $validated) {
                    $mail->from($validated['email'], $validated['name'])
                        ->to($adminEmail)
                        ->subject('Nuevo mensaje de contacto: ' . $subject);
                }
            );
        } catch (\Exception $e) {
            // Si falla el email, no bloquear — el mensaje ya se guardó en BD
            Log::warning('Error al enviar notificación de contacto por email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Mensaje recibido correctamente. Te responderemos a la brevedad.',
        ], 201);
    }

    /**
     * Listar mensajes (admin).
     */
    public function index(): JsonResponse
    {
        $messages = ContactMessage::orderByDesc('created_at')->get();

        return response()->json(['data' => $messages]);
    }

    /**
     * Marcar mensaje como leído (admin).
     */
    public function markRead(ContactMessage $contactMessage): JsonResponse
    {
        $contactMessage->update(['is_read' => true]);

        return response()->json(['data' => $contactMessage]);
    }

    /**
     * Eliminar mensaje (admin).
     */
    public function destroy(ContactMessage $contactMessage): JsonResponse
    {
        $contactMessage->delete();

        return response()->json(['message' => 'Mensaje eliminado.']);
    }
}
