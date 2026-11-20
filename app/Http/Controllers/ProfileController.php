<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function show(Request $request): Response
    {
        $user = $request->user();

        $applications = $user->ongApplications()
            ->with('ong')
            ->latest()
            ->get();

        $ownPosts = $user->blogPosts()
            ->orderByDesc('updated_at')
            ->get();

        $savedPosts = $user->savedBlogPosts()
            ->where('status', 'published')
            ->orderByDesc('saved_blog_posts.created_at')
            ->get();

        $savedJournal = $user->savedJournalArticles()
            ->orderByDesc('saved_journal_articles.created_at')
            ->get();

        $readCount = $user->readBlogPosts()->count();

        return Inertia::render('Profile/Show', [
            'applications' => $applications,
            'ownPosts' => $ownPosts,
            'savedPosts' => $savedPosts,
            'savedJournal' => $savedJournal,
            'stats' => [
                'appliedCount' => $applications->count(),
                'readCount' => $readCount,
                'savedCount' => $savedPosts->count() + $savedJournal->count(),
            ],
        ]);
    }

    public function updateUsername(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'username' => ['required', 'string', 'min:3', 'max:50', Rule::unique('users', 'username')->ignore($user->id)],
        ], [
            'username.required' => 'Informe o nome de usuário.',
            'username.min' => 'O nome precisa ter pelo menos 3 caracteres.',
            'username.unique' => 'Esse nome de usuário já está em uso.',
        ]);

        $user->update([
            'username' => $validated['username'],
            'name' => $validated['username'],
        ]);

        $user->blogPosts()->update(['author_name' => $validated['username']]);

        return back()->with('success', 'Nome atualizado com sucesso!');
    }

    public function updateEmail(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
        ], [
            'email.required' => 'Informe o novo e-mail.',
            'email.email' => 'Digite um e-mail válido, como nome@email.com.',
            'email.unique' => 'Esse e-mail já está cadastrado em outra conta.',
        ]);

        $user->update([
            'email' => mb_strtolower($validated['email']),
        ]);

        return back()->with('success', 'E-mail atualizado com sucesso!');
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ], [
            'current_password.required' => 'Informe sua senha atual.',
            'password.required' => 'Informe a nova senha.',
            'password.min' => 'A nova senha precisa ter pelo menos 6 caracteres.',
            'password.confirmed' => 'As senhas não coincidem.',
        ]);

        if (! Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => 'Senha atual incorreta.',
            ]);
        }

        if ($validated['current_password'] === $validated['password']) {
            throw ValidationException::withMessages([
                'password' => 'A nova senha deve ser diferente da atual.',
            ]);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Senha alterada com sucesso!');
    }

    public function updateAvatar(Request $request): RedirectResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'max:12288'],
        ], [
            'avatar.required' => 'Selecione uma imagem.',
            'avatar.image' => 'Escolha um arquivo de imagem válido.',
            'avatar.max' => 'A imagem deve ter no máximo 12 MB.',
        ]);

        $user = $request->user();

        if ($user->avatar_path) {
            Storage::disk('public')->delete($user->avatar_path);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar_path' => $path]);

        return back()->with('success', 'Foto de perfil atualizada!');
    }

    public function removeAvatar(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->avatar_path) {
            Storage::disk('public')->delete($user->avatar_path);
            $user->update(['avatar_path' => null]);
        }

        return back()->with('info', 'Foto de perfil removida.');
    }
}
