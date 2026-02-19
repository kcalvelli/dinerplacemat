/**
 * GET /api/admin/all
 * Returns all listings with optional status filter (requires auth)
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

    // Get status filter
    const url = new URL(request.url);
    const statusFilter = url.searchParams.get('status') || 'all';
    
    let query = `
      SELECT 
        id, business_name, contact_email, contact_phone, description,
        parish, location_city, location_state, business_type,
        website_url, logo_url, status, submitted_at, approved_at,
        expires_at, rejection_reason
      FROM listings
      WHERE 1=1
    `;
    
    const params = [];
    
    // Add status filter
    if (statusFilter !== 'all') {
      query += ` AND status = ?`;
      params.push(statusFilter);
    }
    
    // Order by submitted date
    query += ` ORDER BY submitted_at DESC`;
    
    const { results } = await env.DB.prepare(query).bind(...params).all();
    
    return new Response(
      JSON.stringify(results || []),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error fetching all listings:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch listings' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
