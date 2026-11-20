<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\JournalController;
use App\Http\Controllers\OngController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/quem-somos', [HomeController::class, 'about'])->name('about');

Route::get('/ongs', [OngController::class, 'index'])->name('ongs.index');
Route::get('/ongs/{ong:slug}', [OngController::class, 'show'])->name('ongs.show');

Route::get('/blogs', [BlogController::class, 'index'])->name('blogs.index');
Route::middleware('auth')->group(function () {
    Route::get('/blogs/novo', [BlogController::class, 'create'])->name('blogs.create');
    Route::post('/blogs', [BlogController::class, 'store'])->name('blogs.store');
    Route::get('/blogs/{post:slug}/editar', [BlogController::class, 'edit'])->name('blogs.edit');
    Route::put('/blogs/{post:slug}', [BlogController::class, 'update'])->name('blogs.update');
    Route::delete('/blogs/{post:slug}', [BlogController::class, 'destroy'])->name('blogs.destroy');
    Route::post('/blogs/{post:slug}/salvar', [BlogController::class, 'toggleSave'])->name('blogs.save');

    Route::post('/ongs/{ong:slug}/ajudar', [OngController::class, 'apply'])->name('ongs.apply');
    Route::get('/ongs/{ong:slug}/solicitacao', [OngController::class, 'applied'])->name('ongs.applied');

    Route::post('/jornal/{article}/salvar', [JournalController::class, 'toggleSave'])->name('journal.save');

    Route::get('/perfil', [ProfileController::class, 'show'])->name('profile');
    Route::patch('/perfil/nome', [ProfileController::class, 'updateUsername'])->name('profile.username');
    Route::patch('/perfil/email', [ProfileController::class, 'updateEmail'])->name('profile.email');
    Route::patch('/perfil/senha', [ProfileController::class, 'updatePassword'])->name('profile.password');
    Route::post('/perfil/foto', [ProfileController::class, 'updateAvatar'])->name('profile.avatar');
    Route::delete('/perfil/foto', [ProfileController::class, 'removeAvatar'])->name('profile.avatar.remove');

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

Route::get('/blogs/{post:slug}', [BlogController::class, 'show'])->name('blogs.show');
Route::get('/jornal', [JournalController::class, 'index'])->name('journal.index');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.store');
    Route::get('/cadastro', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/cadastro', [AuthController::class, 'register'])->name('register.store');
    Route::get('/esqueci-senha', [AuthController::class, 'showForgotPassword'])->name('password.request');
    Route::post('/esqueci-senha/codigo', [AuthController::class, 'sendResetCode'])->name('password.code');
    Route::post('/esqueci-senha/redefinir', [AuthController::class, 'resetPassword'])->name('password.reset');
});

Route::get('/api/cep/{cep}', [AuthController::class, 'lookupCep'])->name('cep.lookup');
