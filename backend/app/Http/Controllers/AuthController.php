<?php

namespace App\Http\Controllers;

use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Http\Resources\UserResource;
use App\Mail\ResetPasswordMail;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Authenticate user via SPA session (Sanctum stateful).
     *
     * Expects CSRF token cookie (XSRF-TOKEN) to be set first via
     * GET /sanctum/csrf-cookie.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Credenciales inválidas.'],
            ]);
        }

        // Log in via the web guard (session-based for SPA)
        Auth::login($user);

        // Also issue a Sanctum token for API clients that need it
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }

    /**
     * Register a new user.
     *
     * Creates user with 'cliente' role and auto-logs in.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
        ]);

        // Assign default customer role
        $user->assignRole('cliente');

        // Auto-login after registration
        Auth::login($user);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ], 201);
    }

    /**
     * Logout — clear session and revoke tokens.
     */
    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user) {
            // Revoke current token if using Bearer auth
            $token = $user->currentAccessToken();
            if ($token) {
                $token->delete();
            }
        }

        // Log out of web session (if using SPA auth)
        Auth::guard('web')->logout();

        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json(['message' => 'Sesión cerrada correctamente.']);
    }

    /**
     * Send password reset link to the user's email.
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $email = $request->email;

        // Generate a random token
        $token = Str::random(60);

        // Store/update token in password_reset_tokens table
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            ['token' => $token, 'created_at' => now()]
        );

        // Send email with the reset link
        Mail::to($email)->send(new ResetPasswordMail($token, $email));

        return response()->json([
            'message' => 'Si el correo está registrado, recibirás un link de recuperación.',
        ]);
    }

    /**
     * Reset password using token.
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (! $record) {
            return response()->json([
                'message' => 'Token inválido o expirado.',
            ], 400);
        }

        // Check token expiration (60 minutes)
        $createdAt = Carbon::parse($record->created_at);
        $expiresAt = $createdAt->addMinutes(60);
        if (now()->gt($expiresAt)) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json([
                'message' => 'Token expirado. Solicitá un nuevo link de recuperación.',
            ], 400);
        }

        // Update password
        $user = User::where('email', $request->email)->first();
        $user->password = bcrypt($request->password);
        $user->save();

        // Delete used token
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'message' => 'Contraseña actualizada correctamente.',
        ]);
    }

    /**
     * Get current authenticated user.
     */
    public function user(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'No autenticado.'], 401);
        }

        return response()->json([
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Update current authenticated user's profile.
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'No autenticado.'], 401);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'sometimes|string|max:20',
        ]);

        $user->update($validated);

        return response()->json([
            'user' => new UserResource($user),
            'message' => 'Perfil actualizado correctamente.',
        ]);
    }
}
