/**
 * POST /api/admin/extend
 * Extends a listing's expiration by 6 months (requires auth)
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
    
    // Update listing: extend expiration and set status to approved if expired
    const result = await env.DB.prepare(`
      UPDATE listings 
      SET 
        expires_at = datetime('now', '+6 months'),
        status = CASE 
          WHEN status = 'expired' THEN 'approved'
          ELSE status
        END
      WHERE id = ? AND status IN ('approved', 'expired')
    `).bind(id).run();
    
    if (result.meta?.changes === 0) {
      return new Response(
        JSON.stringify({ error: 'Listing not found or not eligible for extension' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Listing extended successfully'
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error extending listing:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to extend listing' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
