// Server-side Security Utilities
// ==============================
// This module provides server-side security measures including:
// - Rate limiting
// - CSRF protection
// - Input validation/sanitization
// - Security headers

import { NextResponse } from 'next/server';

// In-memory rate limiting store (use Redis in production)
const rateLimitStore = new Map();

// Rate limit configuration
const RATE_LIMITS = {
  api: { windowMs: 60000, maxRequests: 60 },      // 60 requests per minute for general API
  newsletter: { windowMs: 3600000, maxRequests: 5 }, // 5 subscriptions per hour per IP
  login: { windowMs: 900000, maxRequests: 10 },    // 10 login attempts per 15 minutes
  admin: { windowMs: 60000, maxRequests: 30 }      // 30 requests per minute for admin
};

// Clean old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now - data.windowStart > data.windowMs * 2) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

/**
 * Server-side rate limiting
 * @param {string} identifier - Unique identifier (IP, user ID, etc.)
 * @param {string} type - Type of rate limit ('api', 'newsletter', 'login', 'admin')
 * @returns {Object} - { allowed: boolean, remaining: number, retryAfter?: number }
 */
export function checkRateLimit(identifier, type = 'api') {
  const config = RATE_LIMITS[type] || RATE_LIMITS.api;
  const key = `${type}:${identifier}`;
  const now = Date.now();
  
  let data = rateLimitStore.get(key);
  
  if (!data || now - data.windowStart > config.windowMs) {
    // Start new window
    data = {
      windowStart: now,
      windowMs: config.windowMs,
      requests: 1
    };
    rateLimitStore.set(key, data);
    return { allowed: true, remaining: config.maxRequests - 1 };
  }
  
  if (data.requests >= config.maxRequests) {
    const retryAfter = Math.ceil((data.windowStart + config.windowMs - now) / 1000);
    return { 
      allowed: false, 
      remaining: 0, 
      retryAfter,
      message: `Too many requests. Please try again in ${retryAfter} seconds.`
    };
  }
  
  data.requests++;
  rateLimitStore.set(key, data);
  return { allowed: true, remaining: config.maxRequests - data.requests };
}

/**
 * Generate CSRF token
 * @returns {string} - CSRF token
 */
export function generateCSRFToken() {
  const array = new Uint8Array(32);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback for older environments
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate CSRF token
 * @param {string} token - Token from request
 * @param {string} storedToken - Token from session/cookie
 * @returns {boolean}
 */
export function validateCSRFToken(token, storedToken) {
  if (!token || !storedToken) return false;
  return token === storedToken && token.length === 64;
}

/**
 * Sanitize user input to prevent XSS
 * @param {string} input - User input string
 * @returns {string} - Sanitized string
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
    .slice(0, 10000); // Limit length
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {Object} - { valid: boolean, sanitized: string, error?: string }
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }
  
  const sanitized = email.toLowerCase().trim();
  
  // Check length
  if (sanitized.length < 5 || sanitized.length > 254) {
    return { valid: false, error: 'Invalid email length' };
  }
  
  // RFC 5322 compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(sanitized)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  // Check for suspicious patterns (potential injection)
  const suspiciousPatterns = [
    /[<>]/,          // HTML tags
    /javascript:/i,   // JS protocol
    /data:/i,         // Data protocol
    /\0/,             // Null bytes
    /\r|\n/           // Line breaks
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(sanitized)) {
      return { valid: false, error: 'Invalid characters in email' };
    }
  }
  
  return { valid: true, sanitized };
}

/**
 * Get client IP from request
 * @param {Request} request - Next.js request object
 * @returns {string} - Client IP address
 */
export function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

/**
 * Create a rate-limited response
 * @param {number} retryAfter - Seconds until retry allowed
 * @returns {NextResponse}
 */
export function rateLimitedResponse(retryAfter) {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Too many requests. Please slow down.',
      retryAfter 
    },
    { 
      status: 429,
      headers: {
        'Retry-After': String(retryAfter),
        'X-RateLimit-Remaining': '0'
      }
    }
  );
}

/**
 * Add security headers to response
 * @param {NextResponse} response - Response object
 * @returns {NextResponse}
 */
export function addSecurityHeaders(response) {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return response;
}

/**
 * Detect potential bot/attack patterns
 * @param {Request} request - Request object
 * @returns {Object} - { isBot: boolean, reason?: string }
 */
export function detectBot(request) {
  const userAgent = request.headers.get('user-agent') || '';
  
  // Check for missing user agent
  if (!userAgent || userAgent.length < 10) {
    return { isBot: true, reason: 'Missing or invalid user agent' };
  }
  
  // Check for known bot patterns
  const botPatterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i,
    /curl/i, /wget/i, /python-requests/i,
    /postman/i, /insomnia/i
  ];
  
  // Allow common search engine bots
  const allowedBots = [
    /googlebot/i, /bingbot/i, /slurp/i, /duckduckbot/i
  ];
  
  for (const pattern of allowedBots) {
    if (pattern.test(userAgent)) {
      return { isBot: true, reason: 'Search engine bot (allowed)', allowed: true };
    }
  }
  
  for (const pattern of botPatterns) {
    if (pattern.test(userAgent)) {
      return { isBot: true, reason: 'Bot pattern detected' };
    }
  }
  
  return { isBot: false };
}

/**
 * Log security event for monitoring
 * @param {string} eventType - Type of security event
 * @param {Object} details - Event details
 */
export function logSecurityEvent(eventType, details) {
  const event = {
    type: eventType,
    timestamp: new Date().toISOString(),
    ...details
  };
  
  // In production, send to logging service
  console.log('[Security Event]', JSON.stringify(event));
}
