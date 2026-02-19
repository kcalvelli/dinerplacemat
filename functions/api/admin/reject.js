/**
 * POST /api/admin/reject
 * Rejects a pending listing with reason (requires auth)
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
    const { id, reason } = body;
    
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Listing ID required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    if (!reason?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Rejection reason required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Update listing: reject with reason
    const result = await env.DB.prepare(`
      UPDATE listings 
      SET 
        status = 'rejected',
        rejection_reason = ?,
        approved_at = NULL,
        expires_at = NULL
      WHERE id = ? AND status = 'pending'
    `).bind(reason.trim(), id).run();
    
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
        message: 'Listing rejected successfully'
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error rejecting listing:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to reject listing' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
