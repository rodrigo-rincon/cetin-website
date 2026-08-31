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

- `DB_HOST`: private RDS PostgreSQL endpoint.
- `DB_PORT`: PostgreSQL port, normally `5432`.
- `DB_SECRET_ARN`: Secrets Manager ARN containing `username` and `password`.
- `DB_NAME`: PostgreSQL database name.
- `JWT_SECRET`: secret used to verify the existing CETIN HS256 tokens.
- `WEB_ORIGIN`: allowed website origin. Use the real site URL outside local development.

The Lambda runs inside the test database VPC. Its dedicated security group is the
only source added to the database security group on port 5432. The Lambda role needs
`secretsmanager:GetSecretValue` for the database secret and the standard VPC execution
permissions.

The selected RDS subnets are private. Before deployment, verify that they can reach
Secrets Manager through a NAT gateway or an interface VPC endpoint. The current deploy
user cannot inspect route tables, so this prerequisite has not yet been confirmed.

Run `database/migrations/001_web_content.sql` against a non-production environment
first. The tables use the `web_` prefix and do not alter operational CETIN tables.

## Isolation from production

`infrastructure/template.yaml` creates a distinct function named
`cetin-website-content-api-test`. It accepts the RDS and secret configuration as parameters and
does not reference, update, or deploy the existing `cetin-app` Lambda.

The current `cetin-be` token was verified in source: it is signed with HS256, expires
after eight hours, and includes `id` and `rol`. Supply the same signing secret securely
to the new function. Never commit that secret or print it in deployment logs.
