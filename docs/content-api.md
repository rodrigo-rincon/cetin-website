# CETIN website content API

This module is a new, isolated Lambda. It does not modify or deploy the production
Lambda used by `cetin-app`.

## Routes

- `GET /api/content`: public published content.
- `PUT /api/content/:section`: update one section; requires a valid CETIN JWT whose
  `rol` (or `role`) claim is `superadmin`. The Lambda then reads the current
  `usuario` row from Aurora and requires `estatus = 'activo'` and
  `rol = 'superadmin'`, matching the authorization behavior of `cetin-be`.

Supported sections are `hero`, `videosSection`, `stats`, `infoSection`,
`laborAltruista`, `proximamente`, `sucursales`, `contact`, and `footer`.

## Lambda environment

- `DB_CLUSTER_ARN`: Aurora cluster ARN with Data API enabled.
- `DB_SECRET_ARN`: Secrets Manager ARN containing the database credentials.
- `DB_NAME`: PostgreSQL database name.
- `JWT_SECRET`: secret used to verify the existing CETIN HS256 tokens.
- `WEB_ORIGIN`: allowed website origin. Use the real site URL outside local development.

The Lambda role needs `rds-data:ExecuteStatement` for the cluster and
`secretsmanager:GetSecretValue` for the database secret.

Run `database/migrations/001_web_content.sql` against a non-production environment
first. The tables use the `web_` prefix and do not alter operational CETIN tables.

## Isolation from production

`infrastructure/template.yaml` creates a distinct function named
`cetin-website-content-api`. It accepts the Aurora and secret ARNs as parameters and
does not reference, update, or deploy the existing `cetin-app` Lambda.

The current `cetin-be` token was verified in source: it is signed with HS256, expires
after eight hours, and includes `id` and `rol`. Supply the same signing secret securely
to the new function. Never commit that secret or print it in deployment logs.
