import assert from 'node:assert/strict';
import test from 'node:test';
import { SignJWT } from 'jose';
import { getBearerToken, requireSuperadmin } from '../src/auth.js';

const secret = 'test-secret-at-least-32-characters';
const key = new TextEncoder().encode(secret);

async function token(role) {
  return new SignJWT({
    id: '00000000-0000-0000-0000-000000000001',
    rol: role,
    email: 'admin@cetin.com',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject('00000000-0000-0000-0000-000000000001')
    .setExpirationTime('5m')
    .sign(key);
}

test('extracts bearer tokens', () => {
  assert.equal(getBearerToken({ authorization: 'Bearer abc' }), 'abc');
});

test('allows superadmin', async () => {
  const actor = await requireSuperadmin({ authorization: `Bearer ${await token('superadmin')}` }, secret);
  assert.equal(actor.role, 'superadmin');
  assert.equal(actor.id, '00000000-0000-0000-0000-000000000001');
});

test('rejects other roles', async () => {
  await assert.rejects(
    requireSuperadmin({ authorization: `Bearer ${await token('admin')}` }, secret),
    (error) => error.statusCode === 403,
  );
});
