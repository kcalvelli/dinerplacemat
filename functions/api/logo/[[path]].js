/**
 * GET /api/logo/:id
 * Proxy logo images from R2 to avoid SSL/CORS issues
 */

export async function onRequestGet(context) {
  const { request, env } = context;
  
  try {
    // Get the key from URL
    const url = new URL(request.url);
    const path = url.pathname;
    const key = path.replace('/api/logo/', '');
    
    if (!key || key.includes('..')) {
      return new Response('Invalid key', { status: 400 });
    }
    
    // Fetch from R2
    const object = await env.dinerplacemat_logos.get(`logos/${key}`);
    
    if (!object) {
      return new Response('Not found', { status: 404 });
    }
    
    // Get content type from metadata or default to image/jpeg
    const contentType = object.httpMetadata?.contentType || 'image/jpeg';
    
    // Return with proper headers
    return new Response(object.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('Error fetching logo:', error);
    return new Response('Error fetching logo', { status: 500 });
  }
}
