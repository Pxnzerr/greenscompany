<?php

namespace Tests\Feature;

use App\Models\BlogPost;
use App\Models\JournalArticle;
use App\Models\Ong;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class GreensCompanyTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_public_routes_render_successfully(): void
    {
        $this->get('/')->assertOk();
        $this->get('/quem-somos')->assertOk();
        $this->get('/ongs')->assertOk();
        $this->get('/ongs/blue')->assertOk();
        $this->get('/blogs')->assertOk();
        $this->get('/jornal')->assertOk();
        $this->get('/login')->assertOk();
        $this->get('/cadastro')->assertOk();
        $this->get('/esqueci-senha')->assertOk();
    }

    public function test_user_can_register_and_login_with_username_or_email(): void
    {
        $response = $this->post('/cadastro', [
            'email' => 'maria@example.com',
            'username' => 'mariaverde',
            'password' => 'segredo123',
            'password_confirmation' => 'segredo123',
            'cep' => '30130-010',
            'street' => 'Praça Sete de Setembro',
            'neighborhood' => 'Centro',
            'city' => 'Belo Horizonte',
            'state' => 'MG',
        ]);

        $response->assertRedirect('/perfil');
        $this->assertAuthenticated();

        $this->post('/logout')->assertRedirect('/');
        $this->assertGuest();

        $this->post('/login', [
            'login' => 'mariaverde',
            'password' => 'segredo123',
        ])->assertRedirect('/perfil');

        $this->assertAuthenticated();
    }

    public function test_user_can_apply_to_ong_once(): void
    {
        $user = User::where('email', 'demo@greens.com')->firstOrFail();

        $this->actingAs($user)
            ->post('/ongs/blue/ajudar', [
                'availability' => 'Finais de semana',
                'message' => 'Quero ajudar nos mutirões.',
            ])
            ->assertRedirect('/ongs/blue/solicitacao');

        $this->assertDatabaseHas('ong_applications', [
            'user_id' => $user->id,
            'ong_id' => Ong::where('slug', 'blue')->firstOrFail()->id,
            'status' => 'pending',
        ]);

        $this->actingAs($user)
            ->post('/ongs/blue/ajudar')
            ->assertRedirect('/perfil');
    }

    public function test_user_can_create_edit_and_delete_own_blog_post_and_others_cannot(): void
    {
        $owner = User::where('email', 'demo@greens.com')->firstOrFail();
        $other = User::factory()->create([
            'username' => 'outrouser',
            'password' => Hash::make('password123'),
        ]);

        $this->actingAs($owner)
            ->post('/blogs', [
                'title' => 'Meu Guia Sustentável',
                'category' => 'Dicas práticas',
                'content' => 'Conteúdo completo com mais de vinte caracteres para validação.',
                'status' => 'published',
                'sources_text' => "https://ipe.org.br/\nhttps://www.wwf.org.br/",
            ])
            ->assertRedirect('/blogs/meu-guia-sustentavel');

        $post = BlogPost::where('slug', 'meu-guia-sustentavel')->firstOrFail();
        $this->assertSame($owner->id, $post->user_id);

        $this->actingAs($other)
            ->get("/blogs/{$post->slug}/editar")
            ->assertForbidden();

        $this->actingAs($other)
            ->delete("/blogs/{$post->slug}")
            ->assertForbidden();

        $this->actingAs($owner)
            ->put("/blogs/{$post->slug}", [
                'title' => 'Meu Guia Atualizado',
                'category' => 'Tutoriais',
                'content' => 'Texto atualizado com mais de vinte caracteres válidos.',
                'status' => 'published',
            ])
            ->assertRedirect('/blogs/meu-guia-atualizado');

        $this->actingAs($owner)
            ->delete('/blogs/meu-guia-atualizado')
            ->assertRedirect('/blogs');

        $this->assertDatabaseMissing('blog_posts', ['id' => $post->id]);
    }

    public function test_user_can_save_blog_and_journal_and_update_profile(): void
    {
        $user = User::where('email', 'demo@greens.com')->firstOrFail();
        $blog = BlogPost::firstOrFail();
        $journal = JournalArticle::firstOrFail();

        $this->actingAs($user)
            ->post("/blogs/{$blog->slug}/salvar")
            ->assertRedirect();

        $this->actingAs($user)
            ->post("/jornal/{$journal->id}/salvar")
            ->assertRedirect();

        $this->assertTrue($user->savedBlogPosts()->where('blog_posts.id', $blog->id)->exists());
        $this->assertTrue($user->savedJournalArticles()->where('journal_articles.id', $journal->id)->exists());

        $this->actingAs($user)
            ->patch('/perfil/nome', ['username' => 'demo_atualizado'])
            ->assertRedirect();

        $this->assertSame('demo_atualizado', $user->fresh()->username);
    }
}
