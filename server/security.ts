import { Request, Response, NextFunction } from 'express';
import { StructuredEmergencyResponse, SupportedLanguage } from '../src/types.js';
import { findMatchingFallbackGuide } from '../src/data/fallbackGuides.js';

// Allowed image MIME types
export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

// Max file size: 5 MB in bytes
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_TEXT_LENGTH = 2000;
export const MIN_TEXT_LENGTH = 3;

/**
 * Validates and sanitizes user text input
 */
export function validateAndSanitizeText(input: unknown): {
  isValid: boolean;
  sanitized: string;
  error?: string;
} {
  if (input === undefined || input === null) {
    return { isValid: true, sanitized: '' };
  }

  if (typeof input !== 'string') {
    return { isValid: false, sanitized: '', error: 'Text input must be a valid string.' };
  }

  // Strip non-printable ASCII control characters (keep \r \n \t)
  const stripped = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  const trimmed = stripped.trim();

  if (trimmed.length > MAX_TEXT_LENGTH) {
    return {
      isValid: false,
      sanitized: '',
      error: `Emergency description is too long (maximum ${MAX_TEXT_LENGTH} characters).`,
    };
  }

  return { isValid: true, sanitized: trimmed };
}

/**
 * Validates base64 image data, MIME type, size, and header signatures
 */
export function validateImageUpload(
  imageData: unknown,
  imageMimeType: unknown
): {
  isValid: boolean;
  cleanBase64?: string;
  mimeType?: string;
  error?: string;
} {
  if (!imageData) {
    return { isValid: true };
  }

  if (typeof imageData !== 'string') {
    return { isValid: false, error: 'Image data must be a base64 encoded string.' };
  }

  const mime = typeof imageMimeType === 'string' ? imageMimeType.toLowerCase().trim() : 'image/jpeg';
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(mime)) {
    return {
      isValid: false,
      error: `Unsupported image type '${mime}'. Allowed formats: JPEG, PNG, WEBP.`,
    };
  }

  // Extract base64 payload if prefixed with data URI
  const matches = imageData.match(/^data:([a-zA-Z0-9/+-]+);base64,(.+)$/);
  const cleanBase64 = matches ? matches[2] : imageData.replace(/^data:[^;]+;base64,/, '');

  if (!cleanBase64 || cleanBase64.length === 0) {
    return { isValid: false, error: 'Empty or invalid image data.' };
  }

  // Base64 to byte size approximation
  const estimatedBytes = Math.ceil((cleanBase64.length * 3) / 4);
  if (estimatedBytes > MAX_IMAGE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `Image size exceeds the ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB maximum limit.`,
    };
  }

  // Check magic bytes / signatures from decoded buffer prefix
  try {
    const buffer = Buffer.from(cleanBase64.substring(0, 64), 'base64');
    if (buffer.length < 4) {
      return { isValid: false, error: 'Invalid or truncated image file header.' };
    }

    // Check for dangerous / executable signatures
    // PDF header: %PDF
    if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
      return { isValid: false, error: 'PDF documents are not supported for image analysis.' };
    }
    // Windows executable / DOS header: MZ
    if (buffer[0] === 0x4d && buffer[1] === 0x5a) {
      return { isValid: false, error: 'Executable files are strictly rejected.' };
    }
    // HTML / script tag: <script or <!DOCTYPE or <html
    const prefixStr = buffer.toString('utf8', 0, 16).toLowerCase();
    if (prefixStr.includes('<script') || prefixStr.includes('<!doc') || prefixStr.includes('<html')) {
      return { isValid: false, error: 'HTML scripts are strictly rejected.' };
    }

    // Verify valid image header signatures
    const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
    const isWebp =
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 && // RIFF
      buffer.toString('utf8', 8, 12) === 'WEBP';

    if (!isJpeg && !isPng && !isWebp) {
      return {
        isValid: false,
        error: 'Invalid image format. File contents do not match valid JPEG, PNG, or WEBP signatures.',
      };
    }

    return {
      isValid: true,
      cleanBase64,
      mimeType: mime,
    };
  } catch {
    return { isValid: false, error: 'Failed to process image buffer.' };
  }
}

/**
 * Strict schema validator for Gemini output.
 * Ensures the app never crashes from malformed, incomplete, or hostile AI output.
 */
export function validateGeminiOutput(
  raw: any,
  queryContext: string = 'general emergency',
  language: SupportedLanguage | string = 'en'
): StructuredEmergencyResponse {
  if (!raw || typeof raw !== 'object') {
    const fallback = findMatchingFallbackGuide(queryContext);
    fallback.disclaimer = 'SafeGuard AI provided this verified offline safety card.';
    fallback.language = language;
    return fallback;
  }

  // Validate incident title
  const incident = typeof raw.incident === 'string' && raw.incident.trim().length > 0
    ? raw.incident.trim()
    : 'Campus Safety / First-Aid Incident';

  // Validate category
  const validCategories = ['injury', 'medical_illness', 'hazard', 'environmental', 'general'];
  const category = typeof raw.category === 'string' && validCategories.includes(raw.category.toLowerCase())
    ? raw.category.toLowerCase()
    : 'general';

  // Strict urgency validation: only 'low' | 'moderate' | 'high'
  let urgency: 'low' | 'moderate' | 'high' = 'moderate';
  if (typeof raw.urgency === 'string') {
    const norm = raw.urgency.toLowerCase().trim();
    if (norm === 'low' || norm === 'moderate' || norm === 'high') {
      urgency = norm;
    }
  }

  // Validate summary
  const summary = typeof raw.summary === 'string' && raw.summary.trim().length > 0
    ? raw.summary.trim()
    : 'First-response guidance for campus health and safety.';

  // Validate steps
  let steps: string[] = [];
  if (Array.isArray(raw.steps)) {
    steps = raw.steps.filter((s: any) => typeof s === 'string' && s.trim().length > 0).map((s: string) => s.trim());
  }
  if (steps.length === 0) {
    steps = [
      'Ensure the immediate area is safe for yourself and the person involved.',
      'Keep the person calm, resting, and comfortable.',
      'Contact campus security or the campus medical room for evaluation.',
    ];
  }

  // Validate avoid
  let avoid: string[] = [];
  if (Array.isArray(raw.avoid)) {
    avoid = raw.avoid.filter((a: any) => typeof a === 'string' && a.trim().length > 0).map((a: string) => a.trim());
  }
  if (avoid.length === 0) {
    avoid = [
      'Do not move the person if spinal or neck injury is suspected.',
      'Do not administer unprescribed medications or oral fluids if choking/unconscious.',
    ];
  }

  // Validate redFlags
  let redFlags: string[] = [];
  if (Array.isArray(raw.redFlags)) {
    redFlags = raw.redFlags.filter((rf: any) => typeof rf === 'string' && rf.trim().length > 0).map((rf: string) => rf.trim());
  }
  if (redFlags.length === 0) {
    redFlags = [
      'Loss of consciousness or unresponsiveness',
      'Severe, uncontrolled bleeding or deep laceration',
      'Difficulty breathing, chest pain, or blue lips',
    ];
  }

  // Validate boolean
  let callEmergencyServices = Boolean(raw.callEmergencyServices);

  // Validate recommendedContact
  const recommendedContact = typeof raw.recommendedContact === 'string' && raw.recommendedContact.trim().length > 0
    ? raw.recommendedContact.trim()
    : 'Campus Medical Room & Security Dispatch';

  // Validate disclaimer
  const disclaimer = typeof raw.disclaimer === 'string' && raw.disclaimer.trim().length > 0
    ? raw.disclaimer.trim()
    : 'SafeGuard AI provides general first-response guidance and does not replace professional medical diagnosis or emergency services.';

  // Validate criticalQuestions
  let criticalQuestions: string[] | undefined;
  if (Array.isArray(raw.criticalQuestions)) {
    const validQuestions = raw.criticalQuestions
      .filter((q: any) => typeof q === 'string' && q.trim().length > 0)
      .map((q: string) => q.trim());
    if (validQuestions.length > 0) {
      criticalQuestions = validQuestions;
    }
  }

  // Validate hazardDetails
  let hazardDetails: StructuredEmergencyResponse['hazardDetails'] | undefined;
  if (raw.hazardDetails && typeof raw.hazardDetails === 'object') {
    hazardDetails = {
      hazardType: typeof raw.hazardDetails.hazardType === 'string' ? raw.hazardDetails.hazardType : 'Campus Hazard',
      riskLevel: typeof raw.hazardDetails.riskLevel === 'string' ? raw.hazardDetails.riskLevel : 'Moderate',
      notifyDepartment: typeof raw.hazardDetails.notifyDepartment === 'string' ? raw.hazardDetails.notifyDepartment : 'Campus Security / Facilities',
      immediateAction: typeof raw.hazardDetails.immediateAction === 'string' ? raw.hazardDetails.immediateAction : 'Keep safe distance',
    };
  }

  // Conservative escalation check on critical keywords
  const textToCheck = `${queryContext} ${incident} ${summary}`.toLowerCase();
  const criticalKeywords = [
    'unconscious',
    'not responding',
    'unresponsive',
    'collapsed',
    'heavy bleeding',
    'severe bleeding',
    'head trauma',
    'seizure',
    'chest pain',
    'choking',
    "can't breathe",
    'cannot breathe',
    'electric shock',
    'live wire',
    'active fire',
    'poison',
  ];

  if (criticalKeywords.some((kw) => textToCheck.includes(kw))) {
    urgency = 'high';
    callEmergencyServices = true;
  }

  return {
    incident,
    category,
    urgency,
    summary,
    steps,
    avoid,
    redFlags,
    callEmergencyServices,
    recommendedContact,
    disclaimer,
    criticalQuestions,
    hazardDetails,
    language,
    timestamp: new Date().toISOString(),
    source: 'ai',
  };
}

/**
 * Lightweight in-memory Rate Limiter
 */
export function createRateLimiter(options: { maxRequests: number; windowMs: number }) {
  const ipRequests = new Map<string, { count: number; resetTime: number }>();

  // Cleanup expired entries every 2 minutes
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipRequests.entries()) {
      if (now > record.resetTime) {
        ipRequests.delete(ip);
      }
    }
  }, 120000);

  // Prevent keeping process alive in test suites
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    const record = ipRequests.get(ip);
    if (!record || now > record.resetTime) {
      ipRequests.set(ip, { count: 1, resetTime: now + options.windowMs });
      return next();
    }

    if (record.count >= options.maxRequests) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds.toString());
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please wait a moment before submitting another emergency analysis.',
      });
    }

    record.count += 1;
    next();
  };
}

/**
 * Security Headers Middleware
 */
export function securityHeadersMiddleware(req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(self), microphone=(self), geolocation=(self)');
  
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; connect-src 'self'; font-src 'self' data:; object-src 'none'; frame-ancestors 'self' *; base-uri 'self';"
  );
  next();
}
