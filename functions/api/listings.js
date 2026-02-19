/**
 * GET /api/listings
 * Returns approved, non-expired listings with optional search
 */

export async function onRequestGet(context) {
  const { request, env } = context;
  
  try {
    // Get search parameter
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    
    // Build query
    let query = `
      SELECT 
        id, business_name, contact_email, contact_phone, description,
        parish, location_city, location_state, business_type, website_url, logo_url
      FROM listings 
      WHERE status = 'approved' 
        AND (expires_at IS NULL OR expires_at > datetime('now'))
    `;
    
    const params = [];
    
    // Add search conditions if provided
    if (search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      query += ` AND (
        business_name LIKE ? OR 
        description LIKE ? OR 
        parish LIKE ? OR 
        location_city LIKE ? OR 
        location_state LIKE ? OR 
        business_type LIKE ?
      )`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    // Random order
    query += ` ORDER BY RANDOM()`;
    
    // Execute query
    const { results } = await env.DB.prepare(query).bind(...params).all();
    
    return new Response(
      JSON.stringify({ 
        listings: results || [],
        count: results?.length || 0
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60' // Cache for 1 minute
        }
      }
    );
    
  } catch (error) {
    console.error('Error fetching listings:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch listings' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
