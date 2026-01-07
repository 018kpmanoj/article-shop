'use client'

// Client-side rate limiting for DDoS protection
// This works in conjunction with server-side rate limiting

const RATE_LIMIT_CONFIG = {
  // Maximum requests per window
  maxRequests: 100,
  // Time window in milliseconds (1 minute)
  windowMs: 60000,
  // Block duration when rate limit exceeded (5 minutes)
  blockDurationMs: 300000,
  // Maximum failed login attempts
  maxLoginAttempts: 5,
  // Login block duration (15 minutes)
  loginBlockDurationMs: 900000
};

class RateLimiter {
  constructor() {
    this.requests = [];
    this.loginAttempts = [];
    this.isBlocked = false;
    this.blockExpires = null;
    this.loginBlocked = false;
    this.loginBlockExpires = null;
  }

  // Clean old requests outside the window
  cleanOldRequests(requests, windowMs) {
    const now = Date.now();
    return requests.filter(timestamp => now - timestamp < windowMs);
  }

  // Check if client should be rate limited
  checkRateLimit() {
    // Check if currently blocked
    if (this.isBlocked) {
      if (Date.now() > this.blockExpires) {
        this.isBlocked = false;
        this.blockExpires = null;
        this.requests = [];
      } else {
        return {
          allowed: false,
          retryAfter: Math.ceil((this.blockExpires - Date.now()) / 1000),
          reason: 'Too many requests. Please try again later.'
        };
      }
    }

    // Clean old requests
    this.requests = this.cleanOldRequests(this.requests, RATE_LIMIT_CONFIG.windowMs);

    // Check request count
    if (this.requests.length >= RATE_LIMIT_CONFIG.maxRequests) {
      this.isBlocked = true;
      this.blockExpires = Date.now() + RATE_LIMIT_CONFIG.blockDurationMs;
      
      // Log suspicious activity
      this.logSuspiciousActivity('rate_limit_exceeded', {
        requests: this.requests.length
      });

      return {
        allowed: false,
        retryAfter: Math.ceil(RATE_LIMIT_CONFIG.blockDurationMs / 1000),
        reason: 'Rate limit exceeded. Your access has been temporarily restricted.'
      };
    }

    // Add current request
    this.requests.push(Date.now());

    return { allowed: true };
  }

  // Check login rate limit (more restrictive)
  checkLoginRateLimit() {
    // Check if login blocked
    if (this.loginBlocked) {
      if (Date.now() > this.loginBlockExpires) {
        this.loginBlocked = false;
        this.loginBlockExpires = null;
        this.loginAttempts = [];
      } else {
        return {
          allowed: false,
          retryAfter: Math.ceil((this.loginBlockExpires - Date.now()) / 1000),
          reason: 'Too many login attempts. Please try again later.'
        };
      }
    }

    // Clean old attempts
    this.loginAttempts = this.cleanOldRequests(this.loginAttempts, RATE_LIMIT_CONFIG.windowMs);

    // Check attempt count
    if (this.loginAttempts.length >= RATE_LIMIT_CONFIG.maxLoginAttempts) {
      this.loginBlocked = true;
      this.loginBlockExpires = Date.now() + RATE_LIMIT_CONFIG.loginBlockDurationMs;
      
      this.logSuspiciousActivity('login_rate_limit_exceeded', {
        attempts: this.loginAttempts.length
      });

      return {
        allowed: false,
        retryAfter: Math.ceil(RATE_LIMIT_CONFIG.loginBlockDurationMs / 1000),
        reason: 'Too many login attempts. Account temporarily locked.'
      };
    }

    return { allowed: true };
  }

  // Record a login attempt
  recordLoginAttempt(success = false) {
    if (!success) {
      this.loginAttempts.push(Date.now());
    } else {
      // Reset on successful login
      this.loginAttempts = [];
    }
  }

  // Log suspicious activity
  logSuspiciousActivity(type, data) {
    const logEntry = {
      type,
      data,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    };

    // Store locally
    const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    logs.push(logEntry);
    localStorage.setItem('security_logs', JSON.stringify(logs.slice(-50)));

    console.warn('[Security]', type, data);
  }

  // Get current status
  getStatus() {
    return {
      isBlocked: this.isBlocked,
      blockExpires: this.blockExpires,
      loginBlocked: this.loginBlocked,
      loginBlockExpires: this.loginBlockExpires,
      requestCount: this.requests.length,
      loginAttemptCount: this.loginAttempts.length
    };
  }

  // Reset rate limiter (for testing)
  reset() {
    this.requests = [];
    this.loginAttempts = [];
    this.isBlocked = false;
    this.blockExpires = null;
    this.loginBlocked = false;
    this.loginBlockExpires = null;
  }
}

// Singleton instance
let rateLimiterInstance = null;

export function getRateLimiter() {
  if (typeof window === 'undefined') {
    return new RateLimiter();
  }
  
  if (!rateLimiterInstance) {
    rateLimiterInstance = new RateLimiter();
  }
  return rateLimiterInstance;
}

// Check if request should be allowed
export function checkRequest() {
  const limiter = getRateLimiter();
  return limiter.checkRateLimit();
}

// Check if login should be allowed
export function checkLoginRequest() {
  const limiter = getRateLimiter();
  return limiter.checkLoginRateLimit();
}

// Record a login attempt
export function recordLogin(success) {
  const limiter = getRateLimiter();
  limiter.recordLoginAttempt(success);
}

// Honeypot trap for bots
export function checkHoneypot(formData) {
  // Hidden field that bots might fill
  const honeypotFields = ['website', 'phone_number', 'fax', 'company_url'];
  
  for (const field of honeypotFields) {
    if (formData[field]) {
      const limiter = getRateLimiter();
      limiter.logSuspiciousActivity('honeypot_triggered', { field, value: formData[field] });
      return false; // Bot detected
    }
  }
  return true; // Passed honeypot check
}

// Detect rapid form submissions (bot behavior)
let lastFormSubmission = 0;

export function checkFormSubmissionSpeed() {
  const now = Date.now();
  const timeSinceLastSubmission = now - lastFormSubmission;
  
  // If form submitted within 2 seconds of page load or previous submission
  if (timeSinceLastSubmission < 2000 && lastFormSubmission !== 0) {
    const limiter = getRateLimiter();
    limiter.logSuspiciousActivity('rapid_submission', { timeSinceLastSubmission });
    return false;
  }
  
  lastFormSubmission = now;
  return true;
}
