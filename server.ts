import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { analyzeEmergencyWithGemini, translateEmergencyResponse } from "./server/geminiService.js";
import { findMatchingFallbackGuide } from "./src/data/fallbackGuides.js";
import { EmergencyContact } from "./src/types.js";

// Load environment variables
dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();

  // Parse JSON payloads up to 20MB for image base64 uploads
  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ extended: true, limit: "20mb" }));

  // API Routes
  app.get("/api/health", (req, res) => {
    const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY" && process.env.GEMINI_API_KEY.trim() !== "");
    res.json({
      status: "ok",
      geminiConfigured: hasKey,
      timestamp: new Date().toISOString(),
      appName: "SafeGuard AI",
    });
  });

  // Get campus contacts
  app.get("/api/emergency/contacts", (req, res) => {
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

  // Multimodal Emergency Analysis Endpoint
  app.post("/api/emergency/analyze", async (req, res) => {
    try {
      const { text, imageData, imageMimeType, language = "en", isHazardMode = false } = req.body;

      if (!text && !imageData) {
        return res.status(400).json({
          error: "Please provide a description of the emergency or upload a photo.",
        });
      }

      try {
        const result = await analyzeEmergencyWithGemini({
          text,
          imageData,
          imageMimeType,
          language,
          isHazardMode,
        });

        return res.json({
          success: true,
          data: result,
        });
      } catch (geminiError: any) {
        console.warn("Gemini analysis error, utilizing fallback rule system:", geminiError.message);
        
        // Fallback to offline rule system
        const fallbackResult = findMatchingFallbackGuide(text || "general emergency");
        fallbackResult.disclaimer = "AI assistance is temporarily unavailable. SafeGuard AI provided this offline first-aid protocol.";
        
        return res.json({
          success: true,
          data: fallbackResult,
          warning: "Generated from verified offline emergency safety protocol.",
        });
      }
    } catch (err: any) {
      console.error("Critical error in /api/emergency/analyze:", err);
      const fallbackResult = findMatchingFallbackGuide("general emergency");
      return res.status(200).json({
        success: true,
        data: fallbackResult,
        warning: "Fallback emergency card provided.",
      });
    }
  });

  // Emergency Response Translation Endpoint
  app.post("/api/emergency/translate", async (req, res) => {
    try {
      const { data, targetLanguage } = req.body;
      if (!data || !targetLanguage) {
        return res.status(400).json({ error: "Missing data or target language." });
      }

      const translated = await translateEmergencyResponse(data, targetLanguage);
      res.json({ success: true, data: translated });
    } catch (err: any) {
      console.warn("Translation failed, returning original data:", err.message);
      res.json({ success: true, data: req.body.data });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SafeGuard AI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start SafeGuard AI server:", err);
});
