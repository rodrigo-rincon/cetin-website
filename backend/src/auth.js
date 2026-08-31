import { jwtVerify } from 'jose';

const encoder = new TextEncoder();

export function getBearerToken(headers = {}) {
  const authorization = headers.authorization || headers.Authorization || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1] || null;
}

export async function requireSuperadmin(headers, jwtSecret) {
  const token = getBearerToken(headers);
  if (!token) throw Object.assign(new Error('Authentication required'), { statusCode: 401 });
  if (!jwtSecret) throw new Error('JWT_SECRET is not configured');

  const { payload } = await jwtVerify(token, encoder.encode(jwtSecret), {
    algorithms: ['HS256'],
  });
  const role = payload.rol || payload.role || payload.profile?.rol;
  if (role !== 'superadmin') {
    throw Object.assign(new Error('Superadmin access required'), { statusCode: 403 });
  }
  return {
    id: String(payload.id || ''),
    email: String(payload.email || payload.correo || ''),
    role,
  };
}
