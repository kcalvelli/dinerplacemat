/**
 * POST /api/admin/approve
 * Approves a pending listing (requires auth)
 */

import { verifyAuth } from './auth.js';

export async function onRequestPost(context) {
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
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Listing ID required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Update listing: approve with 6-month expiration
    const result = await env.DB.prepare(`
      UPDATE listings 
      SET 
        status = 'approved',
        approved_at = datetime('now'),
        expires_at = datetime('now', '+6 months'),
        rejection_reason = NULL
      WHERE id = ? AND status = 'pending'
    `).bind(id).run();
    
    if (result.meta?.changes === 0) {
      return new Response(
        JSON.stringify({ error: 'Listing not found or already processed' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Listing approved successfully'
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error approving listing:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to approve listing' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
