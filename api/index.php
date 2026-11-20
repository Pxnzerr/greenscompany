<?php

$tmpDirs = [
    '/tmp/storage/app/public',
    '/tmp/storage/framework/cache/data',
    '/tmp/storage/framework/sessions',
    '/tmp/storage/framework/views',
    '/tmp/storage/logs',
];

foreach ($tmpDirs as $dir) {
    if (! is_dir($dir)) {
        @mkdir($dir, 0777, true);
    }
}

$dbConnection = $_ENV['DB_CONNECTION'] ?? getenv('DB_CONNECTION') ?: 'sqlite';
$dbDatabase = $_ENV['DB_DATABASE'] ?? getenv('DB_DATABASE') ?: '/tmp/database.sqlite';

if ($dbConnection === 'sqlite' && $dbDatabase === '/tmp/database.sqlite' && ! file_exists('/tmp/database.sqlite')) {
    $seedSqlite = __DIR__.'/../database/database.sqlite';
    if (file_exists($seedSqlite)) {
        @copy($seedSqlite, '/tmp/database.sqlite');
    }
}

require __DIR__.'/../public/index.php';
