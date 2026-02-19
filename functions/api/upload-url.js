/**
 * POST /api/upload-url
 * Accepts base64 image, uploads to R2, returns public URL
 */

import { validateOrigin } from './admin/auth.js';

export async function onRequestPost(context) {
  const { request, env } = context;

  // Origin validation to prevent abuse from external sites
  if (!validateOrigin(request)) {
    return new Response(
      JSON.stringify({ error: 'Invalid origin' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    const { image, filename } = body;
    
    // Validate inputs
    if (!image || !filename) {
      return new Response(
        JSON.stringify({ error: 'Missing image or filename' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Extract base64 data
    const base64Match = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (!base64Match) {
      return new Response(
        JSON.stringify({ error: 'Invalid base64 format' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    const mimeType = base64Match[1];
    const base64Data = base64Match[2];
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(mimeType)) {
      return new Response(
        JSON.stringify({ error: 'Invalid file type. Only JPEG, PNG, GIF allowed.' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Decode base64
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Validate size (5MB = 5 * 1024 * 1024 bytes)
    if (binaryData.length > 5 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: 'File too large. Maximum 5MB.' }),
        { 
          status: 413,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = mimeType.split('/')[1];
    const uniqueFilename = `${timestamp}-${random}.${extension}`;
    const key = `logos/${uniqueFilename}`;
    
    // Upload to R2
    await env.dinerplacemat_logos.put(key, binaryData, {
      httpMetadata: {
        contentType: mimeType,
        cacheControl: 'public, max-age=31536000' // 1 year
      }
    });
    
    // Construct proxy URL (serves through our domain to avoid SSL/CORS issues)
    // Extract just the filename from the key (logos/filename.ext -> filename.ext)
    const logoFilename = key.replace('logos/', '');
    const publicUrl = `/api/logo/${logoFilename}`;
    
    return new Response(
      JSON.stringify({ 
        success: true,
        url: publicUrl,
        key: key
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to upload file' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
