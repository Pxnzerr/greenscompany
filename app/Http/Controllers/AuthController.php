<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'login' => ['required', 'string'],
            'password' => ['required', 'string'],
        ], [
            'login.required' => 'Informe seu e-mail ou nome de usuário.',
            'password.required' => 'Informe sua senha.',
        ]);

        $identifier = mb_strtolower(trim($credentials['login']));

        $user = User::query()
            ->whereRaw('LOWER(email) = ?', [$identifier])
            ->orWhereRaw('LOWER(username) = ?', [$identifier])
            ->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'login' => 'Não encontramos uma conta com esse e-mail ou usuário.',
            ]);
        }

        if (! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'password' => 'Senha incorreta. Tente novamente.',
            ]);
        }

        Auth::login($user, $request->boolean('remember', true));
        $request->session()->regenerate();

        return redirect()
            ->intended(route('profile'))
            ->with('success', 'Bem-vindo(a), '.$user->username.'!');
    }

    public function showRegister(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function register(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'username' => ['required', 'string', 'min:3', 'max:50', 'unique:users,username'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
            'cep' => ['required', 'regex:/^\d{5}-\d{3}$/'],
            'street' => ['required', 'string', 'max:255'],
            'neighborhood' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'state' => ['required', 'string', 'size:2'],
        ], [
            'email.required' => 'Informe seu e-mail.',
            'email.email' => 'Digite um e-mail válido, como nome@email.com.',
            'email.unique' => 'Já existe uma conta cadastrada com esse e-mail.',
            'username.required' => 'Informe um nome de usuário.',
            'username.min' => 'O nome de usuário precisa ter pelo menos 3 caracteres.',
            'username.unique' => 'Esse nome de usuário já está em uso.',
            'password.required' => 'Crie uma senha.',
            'password.min' => 'A senha precisa ter pelo menos 6 caracteres.',
            'password.confirmed' => 'As senhas não coincidem.',
            'cep.required' => 'Informe o CEP.',
            'cep.regex' => 'Digite um CEP completo no formato 00000-000.',
            'street.required' => 'Informe a rua.',
            'neighborhood.required' => 'Informe o bairro.',
            'city.required' => 'Informe a cidade.',
            'state.required' => 'Selecione o estado.',
        ]);

        $user = User::create([
            'name' => $validated['username'],
            'username' => $validated['username'],
            'email' => mb_strtolower($validated['email']),
            'password' => Hash::make($validated['password']),
            'cep' => $validated['cep'],
            'street' => $validated['street'],
            'neighborhood' => $validated['neighborhood'],
            'city' => $validated['city'],
            'state' => mb_strtoupper($validated['state']),
        ]);

        Auth::login($user, true);
        $request->session()->regenerate();

        return redirect()
            ->intended(route('profile'))
            ->with('success', 'Conta criada! Bem-vindo(a), '.$user->username.'!');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()
            ->route('home')
            ->with('info', 'Você saiu da conta.');
    }

    public function showForgotPassword(): Response
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    public function sendResetCode(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ], [
            'email.required' => 'Informe o e-mail cadastrado.',
            'email.email' => 'Digite um e-mail válido.',
        ]);

        $email = mb_strtolower(trim($validated['email']));
        $user = User::whereRaw('LOWER(email) = ?', [$email])->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => 'Não encontramos uma conta com esse e-mail.',
            ]);
        }

        $code = str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            ['token' => Hash::make($code), 'created_at' => now()]
        );

        Log::info("Green's Company — Código de redefinição para {$user->email}: {$code}");

        $response = back()->with('success', 'Código de redefinição gerado para '.$user->email.'.');

        if (app()->isLocal()) {
            $response->with('dev_reset_code', $code);
        }

        return $response;
    }

    public function resetPassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'code' => ['required', 'string', 'size:6'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ], [
            'code.required' => 'Informe o código recebido.',
            'code.size' => 'O código deve ter 6 dígitos.',
            'password.required' => 'Informe a nova senha.',
            'password.min' => 'A nova senha precisa ter pelo menos 6 caracteres.',
            'password.confirmed' => 'As senhas não coincidem.',
        ]);

        $email = mb_strtolower(trim($validated['email']));
        $record = DB::table('password_reset_tokens')->where('email', $email)->first();

        if (! $record || now()->diffInMinutes($record->created_at) > 30 || ! Hash::check($validated['code'], $record->token)) {
            throw ValidationException::withMessages([
                'code' => 'Código incorreto ou expirado. Solicite um novo código.',
            ]);
        }

        $user = User::whereRaw('LOWER(email) = ?', [$email])->firstOrFail();
        $user->update(['password' => Hash::make($validated['password'])]);

        DB::table('password_reset_tokens')->where('email', $email)->delete();

        return redirect()
            ->route('login')
            ->with('success', 'Senha redefinida com sucesso! Entre com a nova senha.');
    }

    public function lookupCep(string $cep): JsonResponse
    {
        $digits = preg_replace('/\D/', '', $cep);
        if (strlen($digits) !== 8) {
            return response()->json(['message' => 'CEP inválido'], 422);
        }

        $data = Cache::remember("cep_{$digits}", now()->addDays(7), function () use ($digits) {
            try {
                $viaCep = Http::timeout(5)->acceptJson()->get("https://viacep.com.br/ws/{$digits}/json/");
                if ($viaCep->ok() && ! $viaCep->json('erro') && $viaCep->json('uf')) {
                    return [
                        'street' => (string) $viaCep->json('logradouro'),
                        'neighborhood' => (string) $viaCep->json('bairro'),
                        'city' => (string) $viaCep->json('localidade'),
                        'state' => (string) $viaCep->json('uf'),
                    ];
                }
            } catch (\Throwable) {
            }

            try {
                $brasilApi = Http::timeout(5)->acceptJson()->get("https://brasilapi.com.br/api/cep/v2/{$digits}");
                if ($brasilApi->ok() && $brasilApi->json('state')) {
                    return [
                        'street' => (string) $brasilApi->json('street'),
                        'neighborhood' => (string) $brasilApi->json('neighborhood'),
                        'city' => (string) $brasilApi->json('city'),
                        'state' => (string) $brasilApi->json('state'),
                    ];
                }
            } catch (\Throwable) {
            }

            return null;
        });

        if (! $data) {
            return response()->json(['message' => 'CEP não encontrado'], 404);
        }

        return response()->json($data);
    }
}
