<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public string $token,
        public string $email,
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Recuperación de contraseña - TAG-Q',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $frontendUrl = config('app.frontend_url', 'http://localhost:5173');
        $resetUrl = "{$frontendUrl}/recuperacion/{$this->token}?email={$this->email}";

        return new Content(
            htmlString: $this->buildHtml($resetUrl),
        );
    }

    /**
     * Build the HTML email body.
     */
    private function buildHtml(string $resetUrl): string
    {
        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 16px;">
        <tr>
            <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
                    <tr>
                        <td style="background: #0B2977; padding: 32px; text-align: center;">
                            <h1 style="color: #D4AF37; font-size: 28px; margin: 0; letter-spacing: 2px;">TAG-Q</h1>
                            <p style="color: white; font-size: 12px; margin: 4px 0 0; opacity: 0.8;">Relojería premium colombiana</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 32px;">
                            <h2 style="color: #1A1A1A; font-size: 18px; margin: 0 0 12px;">Recuperación de contraseña</h2>
                            <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
                                Recibimos una solicitud para restablecer la contraseña de tu cuenta TAG-Q.
                                Hacé click en el botón de abajo para crear una nueva contraseña.
                            </p>
                            <table cellpadding="0" cellspacing="0" style="margin: 0 auto 24px;">
                                <tr>
                                    <td style="background: #0B2977; border-radius: 8px; padding: 12px 32px;">
                                        <a href="{$resetUrl}" style="color: white; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block;">
                                            RESTABLECER CONTRASEÑA
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p style="color: #999; font-size: 12px; line-height: 1.5; margin: 0;">
                                Este link expira en 60 minutos. Si no solicitaste este cambio, podés ignorar este correo.
                            </p>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
                            <p style="color: #999; font-size: 11px; margin: 0;">
                                TAG-Q &bull; Colombia<br>
                                Si tenés problemas con el botón, copiá y pegá este link en tu navegador:<br>
                                <a href="{$resetUrl}" style="color: #0B2977; font-size: 11px;">{$resetUrl}</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
HTML;
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
