/**
 * POST /api/admin/logout
 * Clears JWT cookie
 */

import { createLogoutResponse, validateOrigin } from './auth.js';

export async function onRequestPost(context) {
  const { request } = context;

  if (!validateOrigin(request)) {
    return new Response(
      JSON.stringify({ error: 'Invalid origin' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return createLogoutResponse();
}
