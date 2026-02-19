/**
 * POST /api/admin/login
 * Authenticates admin and sets JWT cookie
 */

import { verifyPassword, generateToken, createAuthResponse, createLogoutResponse, ADMIN_USERNAME } from './auth.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const body = await request.json();
    const { username, password } = body;
    
    // Validate username
    if (username !== ADMIN_USERNAME) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Get admin password hash from database
    const { results } = await env.DB.prepare(
      'SELECT password_hash FROM admin_user WHERE id = 1'
    ).all();
    
    if (!results || results.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Admin not configured' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    const passwordHash = results[0].password_hash;
    
    // Verify password
    const valid = await verifyPassword(password, passwordHash);
    
    if (!valid) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Generate JWT
    const token = await generateToken(ADMIN_USERNAME, env.JWT_SECRET);
    
    // Return success with cookie
    return createAuthResponse(token, {
      success: true,
      message: 'Login successful'
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ error: 'Login failed' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * POST /api/admin/logout
 * Clears JWT cookie
 */
export async function onRequestPostLogout(context) {
  return createLogoutResponse();
}

// Re-export verifyAuth for use in other admin endpoints
export { verifyAuth } from './auth.js';
