<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\JournalArticle;
use App\Models\Ong;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $featuredOngs = Ong::query()
            ->where('featured', true)
            ->orderBy('id')
            ->get();

        $latestPosts = BlogPost::query()
            ->where('status', 'published')
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->take(3)
            ->get();

        return Inertia::render('Home', [
            'featuredOngs' => $featuredOngs,
            'latestPosts' => $latestPosts,
            'metrics' => [
                'ongsCount' => Ong::count(),
                'postsCount' => BlogPost::where('status', 'published')->count(),
                'journalCount' => JournalArticle::count(),
            ],
        ]);
    }

    public function about(): Response
    {
        return Inertia::render('About', [
            'team' => [
                ['initials' => 'MC', 'name' => 'Marcos de Castro', 'role' => 'Co-fundador & Conteúdo'],
                ['initials' => 'RC', 'name' => 'Rafael Correia', 'role' => 'Co-fundador & Produto'],
                ['initials' => 'SM', 'name' => 'Samuel Macedo', 'role' => 'Co-fundador & Sustentabilidade'],
                ['initials' => 'PD', 'name' => 'Pablo Daniel', 'role' => 'Co-fundador & Comunidade'],
                ['initials' => 'AC', 'name' => 'Arthur Clark', 'role' => 'Co-fundador & Tecnologia'],
            ],
        ]);
    }
}
