<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title inertia>{{ config('app.name', "Green's Company") }}</title>
    <meta name="description" content="Informe-se sobre a crise climática, conheça ONGs e coloque a mão na obra pelo planeta.">
    <meta name="theme-color" content="#003200">
    <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23003200' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 21c.5-4.5 2.5-8 7-10'/%3E%3Cpath d='M9 18c6.2 0 10.5-3.3 11-12V4h-4c-9 0-12 4-12 9 0 1 0 3 2 5h3z'/%3E%3C/svg%3E">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead
</head>
<body class="bg-[#EAF5EE] text-[#111111] antialiased selection:bg-[#2C8554]/20 selection:text-[#003200]">
    @inertia
</body>
</html>
