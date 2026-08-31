create extension if not exists pgcrypto;

create table if not exists web_content_sections (
  section_key varchar(64) primary key,
  content jsonb not null check (jsonb_typeof(content) in ('object', 'array')),
  published boolean not null default true,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists web_content_audit (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  actor_email text,
  action varchar(32) not null,
  section_key varchar(64) not null,
  previous_data jsonb,
  new_data jsonb,
  source_ip inet,
  created_at timestamptz not null default now()
);

create index if not exists web_content_audit_section_created_idx
  on web_content_audit (section_key, created_at desc);

comment on table web_content_sections is
  'Contenido público administrable de cetin-website. Aislado de las tablas operativas de cetin-app.';
