/**
 * POST /api/intake
 * Creates a new pending listing from form submission
 */

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    const required = ['business_name', 'contact_email', 'business_type', 'parish', 'description'];
    const missing = required.filter(field => !body[field]?.trim());
    
    if (missing.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          fields: missing
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Validate description length
    if (body.description.length > 280) {
      return new Response(
        JSON.stringify({ error: 'Description must be 280 characters or less' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.contact_email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Insert listing
    const result = await env.DB.prepare(`
      INSERT INTO listings (
        business_name, contact_email, contact_phone, description,
        parish, location_city, location_state, business_type,
        website_url, logo_url, status, submitted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'))
    `).bind(
      body.business_name.trim(),
      body.contact_email.trim(),
      body.contact_phone?.trim() || null,
      body.description.trim(),
      body.parish.trim(),
      body.location_city?.trim() || null,
      body.location_state?.trim() || null,
      body.business_type.trim(),
      body.website_url?.trim() || null,
      body.logo_url?.trim() || null
    ).run();
    
    return new Response(
      JSON.stringify({ 
        success: true,
        id: result.meta?.last_row_id,
        message: 'Listing submitted successfully'
      }),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error creating listing:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to submit listing' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
