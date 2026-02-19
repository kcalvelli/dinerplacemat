/**
 * POST /api/admin/delete
 * Deletes a listing and its logo from R2 (requires auth)
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
    
    // Get listing info to find logo URL
    const { results } = await env.DB.prepare(
      'SELECT logo_url FROM listings WHERE id = ?'
    ).bind(id).all();
    
    const logoUrl = results?.[0]?.logo_url;
    
    // Delete listing from database
    const result = await env.DB.prepare(
      'DELETE FROM listings WHERE id = ?'
    ).bind(id).run();
    
    if (result.meta?.changes === 0) {
      return new Response(
        JSON.stringify({ error: 'Listing not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Delete logo from R2 if exists (best effort)
    if (logoUrl) {
      try {
        // Extract key from URL
        const url = new URL(logoUrl);
        const key = url.pathname.substring(1); // Remove leading slash
        
        if (key) {
          await env.dinerplacemat_logos.delete(key);
        }
      } catch (r2Error) {
        console.error('Error deleting logo from R2:', r2Error);
        // Continue - listing deletion is more important
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Listing deleted successfully'
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error deleting listing:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete listing' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
