import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { analyzeEmergencyWithGemini, translateEmergencyResponse } from "./geminiService.js";
import { EmergencyContact } from "../src/types.js";
import {
  validateAndSanitizeText,
  validateImageUpload,
  createRateLimiter,
  securityHeadersMiddleware,
} from "./security.js";

dotenv.config();

export function createApp() {
  const app = express();

  // Trust proxy for rate limiting behind reverse proxies
  app.set("trust proxy", 1);

  // Security headers on all responses
  app.use(securityHeadersMiddleware);

  // Parse JSON payloads up to 10MB
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Safe CORS Configuration
  app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }
    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }
    next();
  });

  // Health check endpoint
  app.get("/api/health", (req: Request, res: Response) => {
    const hasKey = Boolean(
      process.env.GEMINI_API_KEY &&
        process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY" &&
        process.env.GEMINI_API_KEY.trim() !== ""
    );
    res.json({
      status: "ok",
      geminiConfigured: hasKey,
      timestamp: new Date().toISOString(),
      appName: "SafeGuard AI",
    });
  });

  // Campus Emergency Contacts Endpoint
  app.get("/api/emergency/contacts", (req: Request, res: Response) => {
    const contacts: EmergencyContact[] = [
      {
        id: "campus-security",
        title: "Campus Security & Safety",
        subtitle: "24/7 Rapid Response, Patrol & Dispatch",
        phone: process.env.CAMPUS_SECURITY_PHONE || "+1-800-555-0199",
        type: "security",
        iconName: "ShieldAlert",
        isPrimary: true,
      },
      {
        id: "campus-medical",
        title: "Campus Medical Room / Health Center",
        subtitle: "Nurse Station & Immediate First Aid",
        phone: process.env.CAMPUS_MEDICAL_PHONE || "+1-800-555-0144",
        type: "medical",
        iconName: "HeartPulse",
        isPrimary: true,
      },
      {
        id: "personal-contact",
        title: "Personal Emergency Contact",
        subtitle: "Parent / Guardian / Roommate",
        phone: process.env.EMERGENCY_CONTACT_PHONE || "+1-800-555-0100",
        type: "personal",
        iconName: "UserCheck",
      },
      {
        id: "national-emergency",
        title: "National Emergency Services (911 / 112)",
        subtitle: "Paramedics, Fire Dept & Police",
        phone: "911",
        type: "emergency",
        iconName: "PhoneCall",
      },
    ];
    res.json({ contacts });
  });

  // Method Not Allowed handler for contacts
  app.all("/api/emergency/contacts", (req: Request, res: Response) => {
    res.setHeader("Allow", "GET");
    res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed on /api/emergency/contacts. Use GET.`,
    });
  });

  // Lightweight rate limiter: 25 requests per IP per minute
  const analyzeRateLimiter = createRateLimiter({
    maxRequests: 25,
    windowMs: 60 * 1000,
  });

  // Multimodal Emergency Analysis Endpoint (POST only)
  app.post("/api/emergency/analyze", analyzeRateLimiter, async (req: Request, res: Response) => {
    try {
      if (!req.body || typeof req.body !== "object") {
        return res.status(400).json({
          success: false,
          error: "Invalid request payload. Expected JSON object.",
        });
      }

      const { text, imageData, imageMimeType, language = "en", isHazardMode = false } = req.body;

      // 1. Validate text input
      const textValidation = validateAndSanitizeText(text);
      if (!textValidation.isValid) {
        return res.status(400).json({
          success: false,
          error: textValidation.error || "Invalid text input.",
        });
      }

      // 2. Validate image input
      const imageValidation = validateImageUpload(imageData, imageMimeType);
      if (!imageValidation.isValid) {
        return res.status(400).json({
          success: false,
          error: imageValidation.error || "Invalid image upload.",
        });
      }

      // 3. Ensure at least one modality is provided
      const sanitizedText = textValidation.sanitized;
      const hasImage = Boolean(imageValidation.cleanBase64);

      if (!sanitizedText && !hasImage) {
        return res.status(400).json({
          success: false,
          error: "Please provide a description of the emergency or upload a photo.",
        });
      }

      // 4. Validate language parameter
      const validLanguages = ["en", "hi", "hinglish"];
      const targetLang = typeof language === "string" && validLanguages.includes(language.toLowerCase())
        ? language.toLowerCase()
        : "en";

      // 5. Call Gemini Analysis service with verified parameters
      const result = await analyzeEmergencyWithGemini({
        text: sanitizedText,
        imageData: imageValidation.cleanBase64,
        imageMimeType: imageValidation.mimeType,
        language: targetLang,
        isHazardMode: Boolean(isHazardMode),
      });

      return res.json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      // Safe, masked error response (never leak stack trace or internal info)
      console.error("[SafeGuard AI API Error]", err instanceof Error ? err.message : "Unknown error");
      return res.status(500).json({
        success: false,
        error: "Unable to analyze the emergency right now. Please check local safety protocols.",
      });
    }
  });

  // Method Not Allowed handler for analyze
  app.all("/api/emergency/analyze", (req: Request, res: Response) => {
    res.setHeader("Allow", "POST");
    res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed on /api/emergency/analyze. Use POST.`,
    });
  });

  // Emergency Response Translation Endpoint (POST only)
  app.post("/api/emergency/translate", async (req: Request, res: Response) => {
    try {
      if (!req.body || typeof req.body !== "object") {
        return res.status(400).json({
          success: false,
          error: "Invalid request body.",
        });
      }

      const { data, targetLanguage } = req.body;
      if (!data || typeof data !== "object" || !targetLanguage || typeof targetLanguage !== "string") {
        return res.status(400).json({
          success: false,
          error: "Missing or invalid emergency data or target language.",
        });
      }

      const validLanguages = ["en", "hi", "hinglish"];
      const normalizedLang = validLanguages.includes(targetLanguage.toLowerCase())
        ? targetLanguage.toLowerCase()
        : "en";

      const translated = await translateEmergencyResponse(data, normalizedLang);
      return res.json({ success: true, data: translated });
    } catch (err: any) {
      console.error("[SafeGuard AI Translate Error]", err instanceof Error ? err.message : "Unknown error");
      return res.status(500).json({
        success: false,
        error: "Translation is temporarily unavailable.",
      });
    }
  });

  // Method Not Allowed handler for translate
  app.all("/api/emergency/translate", (req: Request, res: Response) => {
    res.setHeader("Allow", "POST");
    res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed on /api/emergency/translate. Use POST.`,
    });
  });

  // Safe global error handler (never leaks stack traces to clients)
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.type === "entity.too.large") {
      return res.status(413).json({
        success: false,
        error: "Uploaded payload is too large. Maximum size is 5MB.",
      });
    }
    console.error("[SafeGuard Express Error]", err?.message || err);
    res.status(500).json({
      success: false,
      error: "An unexpected server error occurred.",
    });
  });

  return app;
}
