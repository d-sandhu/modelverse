# Production deployment

Set `POSTGRES_PASSWORD` and `PUBLIC_ORIGIN`, point the Caddyfile site address at the production hostname when enabling automatic TLS, then run:

```bash
docker compose -f infra/compose.production.yml up --build -d
```

Caddy serves the Vite build and proxies `/api/*`; the API container runs `prisma migrate deploy` before boot. PostgreSQL and API health checks gate startup. World packages remain browser chunks inside the single web build. Back up the `postgres-data` volume and test migrations against a restore before upgrades.
