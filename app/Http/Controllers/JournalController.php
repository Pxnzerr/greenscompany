<?php

namespace App\Http\Controllers;

use App\Models\JournalArticle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JournalController extends Controller
{
    public function index(Request $request): Response
    {
        $articles = JournalArticle::query()
            ->orderByDesc('published_at')
            ->get();

        $savedIds = $request->user()
            ? $request->user()->savedJournalArticles()->pluck('journal_articles.id')->all()
            : [];

        return Inertia::render('Journal/Index', [
            'articles' => $articles,
            'savedIds' => $savedIds,
        ]);
    }

    public function toggleSave(Request $request, JournalArticle $article): RedirectResponse
    {
        $user = $request->user();
        $exists = $user->savedJournalArticles()->where('journal_articles.id', $article->id)->exists();

        if ($exists) {
            $user->savedJournalArticles()->detach($article->id);

            return back()->with('info', 'Jornal removido dos salvos.');
        }

        $user->savedJournalArticles()->attach($article->id);

        return back()->with('success', 'Jornal salvo no perfil com sucesso!');
    }
}
