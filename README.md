# Green’s Company

Plataforma web para conectar pessoas a ONGs ambientais, divulgar notícias climáticas e publicar artigos práticos sobre sustentabilidade.

## Tecnologias

- **Backend:** PHP 8.4, Laravel 13, Inertia.js, SQLite / PostgreSQL
- **Frontend:** React, TypeScript, Tailwind CSS v4, Vite, Lucide Icons

## Executando localmente

1. Instale as dependências:
   ```bash
   composer install
   npm install
   ```
2. Configure o ambiente e o banco de dados:
   ```bash
   cp .env.example .env
   php artisan key:generate
   php artisan migrate --seed
   php artisan storage:link
   ```
3. Compile o frontend e inicie o servidor:
   ```bash
   npm run build
   php artisan serve
   ```
   Para desenvolvimento com hot-reload, execute `npm run dev` em paralelo.

## Testes

```bash
php artisan test
```
