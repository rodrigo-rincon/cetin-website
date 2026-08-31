import { execute } from './database.js';
import { requireSuperadmin } from './auth.js';

const allowedSections = new Set([
  'hero', 'videosSection', 'stats', 'infoSection', 'laborAltruista',
  'proximamente', 'sucursales', 'contact', 'footer',
]);

const response = (statusCode, body) => ({
  statusCode,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': process.env.WEB_ORIGIN || '*',
    'access-control-allow-headers': 'authorization,content-type',
    'access-control-allow-methods': 'GET,PUT,OPTIONS',
  },
  body: JSON.stringify(body),
});

function requestPath(event) {
  return event.rawPath || event.path || '/';
}

function method(event) {
  return event.requestContext?.http?.method || event.httpMethod || 'GET';
}

async function getContent() {
  const rows = await execute(`
    select section_key, content
    from web_content_sections
    where published = true
    order by section_key
  `);
  return Object.fromEntries(rows.map((row) => [row.section_key, row.content]));
}

async function authorizeSuperadmin(event) {
  const claims = await requireSuperadmin(event.headers, process.env.JWT_SECRET);
  if (!claims.id) throw Object.assign(new Error('Token has no user id'), { statusCode: 401 });

  const users = await execute(`
    select id, correo, rol, estatus
    from usuario
    where id = $1::uuid
    limit 1
  `, [claims.id]);
  const user = users[0];
  if (!user || user.estatus !== 'activo') {
    throw Object.assign(new Error('User is inactive or does not exist'), { statusCode: 401 });
  }
  if (user.rol !== 'superadmin') {
    throw Object.assign(new Error('Superadmin access required'), { statusCode: 403 });
  }
  return { id: user.id, email: user.correo, role: user.rol };
}

async function updateSection(section, content, actor, event) {
  await execute(`
    insert into web_content_sections (section_key, content, published, updated_by)
    values ($1, $2::jsonb, true, nullif($3, '')::uuid)
    on conflict (section_key) do update
      set content = excluded.content,
          published = excluded.published,
          updated_by = excluded.updated_by,
          updated_at = now()
  `, [section, JSON.stringify(content), actor.id]);

  await execute(`
    insert into web_content_audit (actor_id, actor_email, action, section_key, new_data, source_ip)
    values (nullif($1, '')::uuid, $2, 'update', $3, $4::jsonb, nullif($5, '')::inet)
  `, [
    actor.id,
    actor.email,
    section,
    JSON.stringify(content),
    event.requestContext?.http?.sourceIp || event.requestContext?.identity?.sourceIp || '',
  ]);
}

export async function handler(event) {
  try {
    const verb = method(event);
    const path = requestPath(event).replace(/\/$/, '') || '/';
    if (verb === 'OPTIONS') return response(204, {});
    if (verb === 'GET' && (path === '/api/content' || path === '/api/web/content')) {
      return response(200, await getContent());
    }

    const match = path.match(/^\/api\/(?:web\/admin\/)?content\/([^/]+)$/);
    if (verb === 'PUT' && match) {
      const section = decodeURIComponent(match[1]);
      if (!allowedSections.has(section)) return response(400, { message: 'Unknown content section' });
      const actor = await authorizeSuperadmin(event);
      const body = JSON.parse(event.body || '{}');
      await updateSection(section, body, actor, event);
      return response(200, { section, updated: true });
    }

    return response(404, { message: 'Route not found' });
  } catch (error) {
    console.error(error);
    return response(error.statusCode || 500, {
      message: error.statusCode ? error.message : 'Internal server error',
    });
  }
}
