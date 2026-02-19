/**
 * Admin Authentication Utilities
 * JWT verification and bcrypt password hashing
 */

import { hashSync, compareSync } from 'bcrypt-edge';

// Admin username is fixed
const ADMIN_USERNAME = 'admin';

/**
 * Verify admin password against stored bcrypt hash
 */
export async function verifyPassword(password, passwordHash) {
  try {
    return compareSync(password, passwordHash);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Generate bcrypt hash of password (for initial setup)
 */
export async function hashPassword(password) {
  return hashSync(password, 10);
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

/**
 * Validate Origin header to prevent CSRF attacks.
 * Allows same-origin requests and requests with no Origin (e.g., direct navigation).
 * For local dev, allows localhost origins.
 */
export function validateOrigin(request) {
  const origin = request.headers.get('Origin');
  if (!origin) {
    // No Origin header - could be same-origin navigation or non-browser client.
    // Check Referer as fallback.
    const referer = request.headers.get('Referer');
    if (!referer) return true; // No origin info - allow (non-browser clients like curl)
    try {
      const refererUrl = new URL(referer);
      const requestUrl = new URL(request.url);
      return refererUrl.origin === requestUrl.origin;
    } catch {
      return false;
    }
  }

  try {
    const requestUrl = new URL(request.url);
    // Allow same origin
    if (origin === requestUrl.origin) return true;
    // Allow localhost variants for local dev
    const originUrl = new URL(origin);
    if (originUrl.hostname === 'localhost' || originUrl.hostname === '127.0.0.1') return true;
    return false;
  } catch {
    return false;
  }
}

export { ADMIN_USERNAME };
