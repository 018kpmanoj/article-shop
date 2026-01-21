import { NextResponse } from 'next/server';
import { 
  checkRateLimit, 
  validateEmail, 
  getClientIP, 
  rateLimitedResponse, 
  addSecurityHeaders,
  logSecurityEvent,
  sanitizeInput
} from '@/lib/serverSecurity';

// Firebase Admin SDK would be better for server-side
// For now, we'll validate and return success to let client handle Firestore

export async function POST(request) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);
    
    // Strict rate limit for subscriptions (5 per hour per IP)
    const rateCheck = checkRateLimit(clientIP, 'newsletter');
    if (!rateCheck.allowed) {
      logSecurityEvent('subscribe_rate_limit', { ip: clientIP });
      return rateLimitedResponse(rateCheck.retryAfter);
    }

    const body = await request.json();
    const { email, honeypot } = body;
    
    // Honeypot check - if filled, it's a bot
    if (honeypot) {
      logSecurityEvent('honeypot_triggered', { ip: clientIP });
      // Return success to not reveal detection
      return NextResponse.json({ success: true, message: 'Subscribed!' });
    }
    
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { success: false, error: emailValidation.error },
        { status: 400 }
      );
    }

    // Sanitize the email
    const sanitizedEmail = emailValidation.sanitized;
    
    // Check for disposable email domains
    const disposableDomains = [
      'tempmail.com', 'throwaway.email', 'guerrillamail.com', 
      'mailinator.com', '10minutemail.com', 'trashmail.com',
      'fakeinbox.com', 'temp-mail.org'
    ];
    
    const emailDomain = sanitizedEmail.split('@')[1];
    if (disposableDomains.some(d => emailDomain.includes(d))) {
      return NextResponse.json(
        { success: false, error: 'Please use a permanent email address' },
        { status: 400 }
      );
    }

    // Log successful validation
    logSecurityEvent('subscribe_validated', { 
      ip: clientIP, 
      email: sanitizedEmail.replace(/(.{2}).*(@.*)/, '$1***$2') // Partially mask for logs
    });

    // Return validated email for client to save to Firestore
    let response = NextResponse.json({ 
      success: true, 
      validated: true,
      email: sanitizedEmail,
      message: 'Email validated. Proceeding with subscription...'
    });
    
    return addSecurityHeaders(response);

  } catch (error) {
    console.error('Subscribe API error:', error);
    logSecurityEvent('subscribe_error', { error: error.message });
    return NextResponse.json(
      { success: false, error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  // Handle CORS preflight
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}
