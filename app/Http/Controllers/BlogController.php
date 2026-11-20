<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    private const CATEGORIES = [
        'Todas',
        'Dicas práticas',
        'Notícias',
        'Tutoriais',
    ];

    public function index(Request $request): Response
    {
        $category = $request->string('category')->toString() ?: 'Todas';
        $search = trim($request->string('q')->toString());
        $sort = $request->string('sort')->toString() ?: 'newest';

        if (! in_array($category, self::CATEGORIES, true)) {
            $category = 'Todas';
        }

        $query = BlogPost::query()->where('status', 'published');

        if ($category !== 'Todas') {
            $query->where('category', $category);
        }

        if ($search !== '') {
            $like = '%'.mb_strtolower($search).'%';
            $query->where(function ($q) use ($like) {
                $q->whereRaw('LOWER(title) LIKE ?', [$like])
                    ->orWhereRaw('LOWER(author_name) LIKE ?', [$like])
                    ->orWhereRaw('LOWER(content) LIKE ?', [$like]);
            });
        }

        match ($sort) {
            'oldest' => $query->orderBy('published_at')->orderBy('id'),
            'title' => $query->orderBy('title'),
            default => $query->orderByDesc('published_at')->orderByDesc('id'),
        };

        $savedIds = $request->user()
            ? $request->user()->savedBlogPosts()->pluck('blog_posts.id')->all()
            : [];

        return Inertia::render('Blogs/Index', [
            'posts' => $query->get(),
            'categories' => self::CATEGORIES,
            'savedIds' => $savedIds,
            'filters' => [
                'category' => $category,
                'q' => $search,
                'sort' => $sort,
            ],
        ]);
    }

    public function show(Request $request, BlogPost $post): Response
    {
        $user = $request->user();

        if ($post->status === 'draft' && (! $user || $post->user_id !== $user->id)) {
            abort(404);
        }

        if ($user && $post->status === 'published') {
            DB::table('read_blog_posts')->updateOrInsert(
                ['user_id' => $user->id, 'blog_post_id' => $post->id],
                ['read_at' => now()]
            );
        }

        $isSaved = $user
            ? $user->savedBlogPosts()->where('blog_posts.id', $post->id)->exists()
            : false;

        return Inertia::render('Blogs/Show', [
            'post' => $post,
            'isSaved' => $isSaved,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Blogs/Editor', [
            'post' => null,
            'categories' => array_slice(self::CATEGORIES, 1),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $isDraft = $request->input('status') === 'draft';
        $validated = $this->validatePost($request, $isDraft);

        $coverPath = null;
        if ($request->hasFile('cover')) {
            $coverPath = $request->file('cover')->store('covers', 'public');
        }

        $title = $validated['title'] ?: 'Rascunho sem título';
        $slug = $this->uniqueSlug($title);

        $post = BlogPost::create([
            'user_id' => $request->user()->id,
            'author_name' => $request->user()->username,
            'title' => $title,
            'slug' => $slug,
            'category' => $validated['category'],
            'content' => $validated['content'] ?? '',
            'cover_path' => $coverPath,
            'cover_alt' => 'Imagem de capa: '.$title,
            'sources' => $this->parseSources($validated['sources_text'] ?? '', ! $isDraft),
            'status' => $isDraft ? 'draft' : 'published',
            'published_at' => ($validated['published_at'] ?? null) ?: now()->toDateString(),
        ]);

        if ($isDraft) {
            return redirect()
                ->route('profile')
                ->with('success', 'Rascunho salvo com sucesso.');
        }

        return redirect()
            ->route('blogs.show', $post->slug)
            ->with('success', 'Artigo publicado!');
    }

    public function edit(Request $request, BlogPost $post): Response
    {
        abort_unless($post->user_id === $request->user()->id, 403);

        return Inertia::render('Blogs/Editor', [
            'post' => $post,
            'categories' => array_slice(self::CATEGORIES, 1),
        ]);
    }

    public function update(Request $request, BlogPost $post): RedirectResponse
    {
        abort_unless($post->user_id === $request->user()->id, 403);

        $isDraft = $request->input('status') === 'draft';
        $validated = $this->validatePost($request, $isDraft);

        $coverPath = $post->cover_path;
        if ($request->boolean('remove_cover') && $coverPath) {
            Storage::disk('public')->delete($coverPath);
            $coverPath = null;
        }

        if ($request->hasFile('cover')) {
            if ($coverPath) {
                Storage::disk('public')->delete($coverPath);
            }
            $coverPath = $request->file('cover')->store('covers', 'public');
        }

        $title = $validated['title'] ?: 'Rascunho sem título';
        $slug = $post->title !== $title ? $this->uniqueSlug($title, $post->id) : $post->slug;

        $post->update([
            'author_name' => $request->user()->username,
            'title' => $title,
            'slug' => $slug,
            'category' => $validated['category'],
            'content' => $validated['content'] ?? '',
            'cover_path' => $coverPath,
            'cover_alt' => 'Imagem de capa: '.$title,
            'sources' => $this->parseSources($validated['sources_text'] ?? '', ! $isDraft),
            'status' => $isDraft ? 'draft' : 'published',
            'published_at' => ($validated['published_at'] ?? null) ?: ($post->published_at?->format('Y-m-d') ?? now()->toDateString()),
        ]);

        if ($isDraft) {
            return redirect()
                ->route('profile')
                ->with('success', 'Rascunho atualizado.');
        }

        return redirect()
            ->route('blogs.show', $post->slug)
            ->with('success', 'Artigo atualizado e publicado!');
    }

    public function destroy(Request $request, BlogPost $post): RedirectResponse
    {
        abort_unless($post->user_id === $request->user()->id, 403);

        if ($post->cover_path) {
            Storage::disk('public')->delete($post->cover_path);
        }

        $post->delete();

        return redirect()
            ->route('blogs.index')
            ->with('success', 'Artigo excluído.');
    }

    public function toggleSave(Request $request, BlogPost $post): RedirectResponse
    {
        $user = $request->user();
        $exists = $user->savedBlogPosts()->where('blog_posts.id', $post->id)->exists();

        if ($exists) {
            $user->savedBlogPosts()->detach($post->id);

            return back()->with('info', 'Blog removido dos favoritos.');
        }

        $user->savedBlogPosts()->attach($post->id);

        return back()->with('success', 'Blog adicionado aos favoritos!');
    }

    private function validatePost(Request $request, bool $isDraft): array
    {
        return $request->validate([
            'title' => $isDraft ? ['nullable', 'string', 'max:180'] : ['required', 'string', 'min:3', 'max:180'],
            'category' => ['required', Rule::in(array_slice(self::CATEGORIES, 1))],
            'content' => $isDraft ? ['nullable', 'string', 'max:30000'] : ['required', 'string', 'min:20', 'max:30000'],
            'published_at' => ['nullable', 'date'],
            'sources_text' => ['nullable', 'string', 'max:4000'],
            'cover' => ['nullable', 'image', 'max:12288'],
        ], [
            'title.required' => 'Informe o título do artigo.',
            'title.min' => 'Informe o título do artigo (mínimo de 3 caracteres).',
            'content.required' => 'Escreva o texto do artigo.',
            'content.min' => 'Escreva o texto do artigo (mínimo de 20 caracteres).',
            'published_at.date' => 'Data inválida.',
            'cover.image' => 'Escolha um arquivo de imagem válido.',
            'cover.max' => 'A imagem de capa deve ter no máximo 12 MB.',
        ]);
    }

    private function parseSources(string $raw, bool $strict): array
    {
        $lines = array_values(array_filter(array_map('trim', preg_split('/\r\n|\r|\n/', $raw) ?: [])));
        $sources = [];

        foreach ($lines as $line) {
            if (! filter_var($line, FILTER_VALIDATE_URL) || ! preg_match('/^https?:\/\//i', $line)) {
                if ($strict) {
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        'sources_text' => 'Confira os links das fontes. Use endereços completos começando com http:// ou https://.',
                    ]);
                }

                continue;
            }

            $host = preg_replace('/^www\./i', '', parse_url($line, PHP_URL_HOST) ?: $line);
            $sources[] = ['title' => $host, 'url' => $line];
        }

        return $sources;
    }

    private function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title) ?: 'artigo';
        $slug = $base;
        $counter = 2;

        while (
            BlogPost::query()
                ->where('slug', $slug)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
