<?php

namespace App\Http\Controllers;

use App\Models\Ong;
use App\Models\OngApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OngController extends Controller
{
    private const CAUSES = [
        'Todas',
        'Reflorestamento',
        'Água e vida marinha',
        'Tecnologia',
        'Biodiversidade',
    ];

    public function index(Request $request): Response
    {
        $cause = $request->string('cause')->toString() ?: 'Todas';
        $search = trim($request->string('q')->toString());

        if (! in_array($cause, self::CAUSES, true)) {
            $cause = 'Todas';
        }

        $query = Ong::query()->orderBy('id');

        if ($cause !== 'Todas') {
            $query->where('cause', $cause);
        }

        if ($search !== '') {
            $like = '%'.mb_strtolower($search).'%';
            $query->where(function ($q) use ($like) {
                $q->whereRaw('LOWER(name) LIKE ?', [$like])
                    ->orWhereRaw('LOWER(location) LIKE ?', [$like])
                    ->orWhereRaw('LOWER(cause) LIKE ?', [$like])
                    ->orWhereRaw('LOWER(cause_label) LIKE ?', [$like])
                    ->orWhereRaw('LOWER(mission) LIKE ?', [$like]);
            });
        }

        return Inertia::render('Ongs/Index', [
            'ongs' => $query->get(),
            'causes' => self::CAUSES,
            'filters' => [
                'cause' => $cause,
                'q' => $search,
            ],
        ]);
    }

    public function show(Request $request, Ong $ong): Response
    {
        $application = null;

        if ($request->user()) {
            $application = OngApplication::query()
                ->where('user_id', $request->user()->id)
                ->where('ong_id', $ong->id)
                ->first();
        }

        return Inertia::render('Ongs/Show', [
            'ong' => $ong,
            'application' => $application,
        ]);
    }

    public function apply(Request $request, Ong $ong): RedirectResponse
    {
        $user = $request->user();

        $existing = OngApplication::query()
            ->where('user_id', $user->id)
            ->where('ong_id', $ong->id)
            ->first();

        if ($existing) {
            return redirect()
                ->route('profile')
                ->with('info', 'Você já enviou uma solicitação para esta ONG.');
        }

        $validated = $request->validate([
            'availability' => ['nullable', 'string', 'max:100'],
            'message' => ['nullable', 'string', 'max:1000'],
        ]);

        OngApplication::create([
            'user_id' => $user->id,
            'ong_id' => $ong->id,
            'status' => 'pending',
            'availability' => $validated['availability'] ?? null,
            'message' => $validated['message'] ?? null,
        ]);

        return redirect()
            ->route('ongs.applied', $ong->slug)
            ->with('success', 'Solicitação de voluntariado enviada!');
    }

    public function applied(Ong $ong): Response
    {
        return Inertia::render('Ongs/Applied', [
            'ong' => $ong,
        ]);
    }
}
