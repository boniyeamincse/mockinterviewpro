# TODO (BlackboxAI)

- [x] Wire auth routes into `backend/routes/api.php` so `/api/auth/*` works
- [ ] Fix failing `php artisan migrate --force` due to existing `cache` table (0001_01_01_000001_create_cache_table.php)
- [ ] Run migrations again after fixing the cache-table duplication
- [ ] Verify Event routes appear in `php artisan route:list`
- [ ] Validate Event endpoints via quick curl smoke test (auth->create event->list/show->status update)

