import { execute } from './database.js';
import { requireSuperadmin } from './auth.js';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'node:crypto';

const s3 = new S3Client({});
const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

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
    'access-control-allow-methods': 'GET,PUT,POST,DELETE,OPTIONS',
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

function safeSegment(value, fallback) {
  const normalized = String(value || '').toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
  return normalized || fallback;
}

async function createUploadUrl(event) {
  await authorizeSuperadmin(event);
  const body = JSON.parse(event.body || '{}');
  if (!allowedImageTypes.has(body.contentType)) {
    throw Object.assign(new Error('Unsupported image type'), { statusCode: 400 });
  }
  const scope = body.scope === 'upcoming' ? 'upcoming' : 'branches';
  const owner = scope === 'upcoming' ? 'section' : safeSegment(body.branchId, 'unassigned');
  const extension = safeSegment(String(body.fileName || '').split('.').pop(), 'jpg');
  const key = `${scope}/${owner}/${randomUUID()}.${extension}`;
  const command = new PutObjectCommand({
    Bucket: process.env.MEDIA_BUCKET,
    Key: key,
    ContentType: body.contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  });
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
  return { uploadUrl, key, publicUrl: `${process.env.MEDIA_PUBLIC_URL}/${key}` };
}

async function removeMedia(event) {
  await authorizeSuperadmin(event);
  const { key } = JSON.parse(event.body || '{}');
  if (!/^(branches|upcoming)\//.test(String(key || ''))) {
    throw Object.assign(new Error('Invalid media key'), { statusCode: 400 });
  }
  await s3.send(new DeleteObjectCommand({ Bucket: process.env.MEDIA_BUCKET, Key: key }));
}

export async function handler(event) {
  try {
    const verb = method(event);
    const path = requestPath(event).replace(/\/$/, '') || '/';
    if (verb === 'OPTIONS') return response(204, {});
    if (verb === 'GET' && (path === '/api/content' || path === '/api/web/content')) {
      return response(200, await getContent());
    }

    if (verb === 'POST' && path === '/api/media/upload-url') {
      return response(200, await createUploadUrl(event));
    }
    if (verb === 'DELETE' && path === '/api/media') {
      await removeMedia(event);
      return response(200, { deleted: true });
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
