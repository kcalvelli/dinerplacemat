/**
 * GET /api/admin/pending
 * Returns all pending listings (requires auth)
 */

import { verifyAuth } from './auth.js';

export async function onRequestGet(context) {
  const { request, env } = context;

  // Verify authentication
  const auth = await verifyAuth(request, env.JWT_SECRET);
  if (!auth) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  try {
    // Auto-expire approved listings whose expires_at has passed
    await env.DB.prepare(`
      UPDATE listings SET status = 'expired'
      WHERE status = 'approved' AND expires_at IS NOT NULL AND expires_at <= datetime('now')
    `).run();

    const { results } = await env.DB.prepare(`
      SELECT 
        id, business_name, contact_email, contact_phone, description,
        parish, location_city, location_state, business_type,
        website_url, logo_url, status, submitted_at, rejection_reason
      FROM listings 
      WHERE status = 'pending'
      ORDER BY submitted_at ASC
    `).all();
    
    return new Response(
      JSON.stringify(results || []),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error fetching pending listings:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch listings' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
