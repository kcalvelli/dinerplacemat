/**
 * Admin Authentication Utilities
 * JWT verification and password hashing
 */

// Admin username is fixed
const ADMIN_USERNAME = 'admin';

// Store password hash in database - we'll verify using SHA-256 for Workers compatibility

/**
 * Verify admin password against stored hash
 * Uses SHA-256 hash comparison (simpler for Workers environment)
 */
export async function verifyPassword(password, passwordHash) {
  try {
    // Hash the provided password
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const computedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Timing-safe comparison
    if (computedHash.length !== passwordHash.length) {
      return false;
    }
    
    let result = 0;
    for (let i = 0; i < computedHash.length; i++) {
      result |= computedHash.charCodeAt(i) ^ passwordHash.charCodeAt(i);
    }
    
    return result === 0;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Generate SHA-256 hash of password (for initial setup)
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify JWT token from cookie
 */
export async function verifyAuth(request, jwtSecret) {
  const cookie = request.headers.get('Cookie');
  if (!cookie) return null;
  
  const tokenMatch = cookie.match(/auth_token=([^;]+)/);
  if (!tokenMatch) return null;
  
  const token = tokenMatch[1];
  
  try {
    // Simple JWT verification
    const [headerB64, payloadB64, signature] = token.split('.');
    
    // Verify signature
    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(jwtSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    );
    
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      base64UrlDecode(signature),
      data
    );
    
    if (!valid) return null;
    
    // Decode payload
    const payload = JSON.parse(base64UrlDecode(payloadB64, 'string'));
    
    // Check expiration
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return null;
    }
    
    return payload;
    
  } catch (error) {
    return null;
  }
}

/**
 * Generate JWT token
 */
export async function generateToken(username, jwtSecret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    sub: username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  
  const encoder = new TextEncoder();
  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  
  const data = encoder.encode(`${headerB64}.${payloadB64}`);
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(jwtSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, data);
  const signatureB64 = base64UrlEncodeBuffer(signature);
  
  return `${headerB64}.${payloadB64}.${signatureB64}`;
}

/**
 * Create auth response with cookie
 */
export function createAuthResponse(token, body, status = 200) {
  const cookie = `auth_token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=86400; Path=/`;
  
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookie
      }
    }
  );
}

/**
 * Create logout response (clear cookie)
 */
export function createLogoutResponse() {
  const cookie = `auth_token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/`;
  
  return new Response(
    JSON.stringify({ success: true }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookie
      }
    }
  );
}

/**
 * Base64 URL encoding helpers
 */
function base64UrlEncode(str) {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function base64UrlEncodeBuffer(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return base64UrlEncode(binary);
}

function base64UrlDecode(str, encoding = 'buffer') {
  str += new Array(5 - str.length % 4).join('=');
  str = str
    .replace(/\-/g, '+')
    .replace(/\_/g, '/');
  
  const decoded = atob(str);
  
  if (encoding === 'string') {
    return decoded;
  }
  
  const bytes = new Uint8Array(decoded.length);
  for (let i = 0; i < decoded.length; i++) {
    bytes[i] = decoded.charCodeAt(i);
  }
  return bytes.buffer;
}

export { ADMIN_USERNAME };
