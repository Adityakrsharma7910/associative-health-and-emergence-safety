import { GoogleGenAI, Type } from "@google/genai";
import { StructuredEmergencyResponse, SupportedLanguage } from "../src/types.js";

// Lazy-initialized Gemini client
let genAIInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!genAIInstance) {
    genAIInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIInstance;
}

const emergencySchema = {
  type: Type.OBJECT,
  properties: {
    incident: {
      type: Type.STRING,
      description: "Concise title of the incident, e.g. 'Possible Ankle Sprain' or 'Exposed Live Wire Hazard'",
    },
    category: {
      type: Type.STRING,
      description: "Category: injury, medical_illness, hazard, environmental, or general",
    },
    urgency: {
      type: Type.STRING,
      description: "Urgency level: 'low', 'moderate', or 'high'. Be conservative: severe pain, heavy bleeding, head trauma, unconsciousness, or high voltage hazards MUST be 'high'.",
    },
    summary: {
      type: Type.STRING,
      description: "1-2 sentence calm summary of what appears to be happening.",
    },
    steps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 to 6 short, numbered, actionable first-response steps.",
    },
    avoid: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2 to 4 crucial actions to strictly avoid.",
    },
    redFlags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 to 5 critical danger signs requiring immediate professional medical or security escalation.",
    },
    callEmergencyServices: {
      type: Type.BOOLEAN,
      description: "Whether immediate professional emergency escalation (911/112/Campus Security) is required.",
    },
    recommendedContact: {
      type: Type.STRING,
      description: "Recommended campus point of contact (e.g. 'Campus Medical Room', 'Campus Security (Urgent)', 'Campus Facilities / Maintenance').",
    },
    disclaimer: {
      type: Type.STRING,
      description: "Safety disclaimer: 'SafeGuard AI provides general first-response guidance and does not replace professional medical diagnosis or emergency services.'",
    },
    criticalQuestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "1 to 3 vital follow-up questions to check the victim's status (e.g. 'Is the person breathing normally?').",
    },
    hazardDetails: {
      type: Type.OBJECT,
      properties: {
        hazardType: { type: Type.STRING },
        riskLevel: { type: Type.STRING },
        notifyDepartment: { type: Type.STRING },
        immediateAction: { type: Type.STRING },
      },
      description: "Optional details if the situation is a physical campus hazard.",
    },
  },
  required: [
    "incident",
    "category",
    "urgency",
    "summary",
    "steps",
    "avoid",
    "redFlags",
    "callEmergencyServices",
    "recommendedContact",
    "disclaimer",
  ],
};

const SYSTEM_INSTRUCTION = `You are SafeGuard AI, a first-response campus health and safety assistant for college students and staff.

Your role is to provide calm, concise, conservative, structured first-response guidance for minor medical incidents and physical campus safety hazards.

CRITICAL RESPONSIBLE AI GUIDELINES:
1. You are NOT a physician and must NOT provide definitive medical diagnoses or prescribe medications. Use cautious phrasing like "Possible sprain", "Appears consistent with a minor cut", "Potential burn injury".
2. PRIORITIZE IMMEDIATE SAFETY: When there are signs of severe bleeding, unconsciousness, head/neck injury, breathing distress, chest pain, high-voltage electricity, major chemical spill, or active fire, set urgency to 'high' and callEmergencyServices to true.
3. Keep instructions SHORT, DIRECT, and NUMBERED. Avoid long paragraphs. Stressed users need quick, scannable steps.
4. For images, describe only relevant visible safety information and acknowledge any visual uncertainty.
5. If the requested language is Hindi, output all user-facing strings (incident, summary, steps, avoid, redFlags, recommendedContact, disclaimer) in natural Hindi (Devanagari script).
6. If the requested language is Hinglish, output all user-facing strings in friendly conversational Romanized Hindi / Hinglish (e.g., "Ghayal person ko aaram se bithayein", "Ice pack ko kapde me lapet kar lagayein", "Zor se chalne ya daudne ki koshish na karein").
7. If the requested language is English, output in clear, simple English.
8. Output ONLY valid JSON adhering to the provided schema.`;

export async function analyzeEmergencyWithGemini(params: {
  text?: string;
  imageData?: string; // base64 string
  imageMimeType?: string;
  language?: SupportedLanguage | string;
  isHazardMode?: boolean;
}): Promise<StructuredEmergencyResponse> {
  const { text = "", imageData, imageMimeType = "image/jpeg", language = "en", isHazardMode = false } = params;
  const ai = getGeminiClient();

  if (!ai) {
    throw new Error("GEMINI_API_KEY is not configured on the server. Falling back to local safety rules.");
  }

  const parts: Array<{ text?: string; inlineData?: { data: string; mimeType: string } }> = [];

  // Add image if present
  if (imageData) {
    // Strip data:image/...;base64, prefix if included
    const cleanBase64 = imageData.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, "");
    parts.push({
      inlineData: {
        data: cleanBase64,
        mimeType: imageMimeType,
      },
    });
  }

  // Construct prompt
  let promptText = "";
  if (isHazardMode) {
    promptText += `[CAMPUS HAZARD REPORTING MODE]\n`;
  }
  if (text.trim()) {
    promptText += `User Emergency Description: "${text.trim()}"\n`;
  } else if (imageData) {
    promptText += `Analyze the attached image for campus medical first-aid needs or physical safety hazards.\n`;
  }

  promptText += `Target Output Language: ${language} (Format: ${
    language === "hi"
      ? "Pure Hindi in Devanagari script"
      : language === "hinglish"
      ? "Hinglish (Roman Hindi/English conversational mix)"
      : "Clear simple English"
  }). Ensure steps are clear, calm, and actionable.`;

  parts.push({ text: promptText });

  const response = await ai.models.generateContent({
    model: "gemini-3.7-flash",
    contents: {
      parts,
    },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: emergencySchema,
      temperature: 0.2, // Low temperature for high consistency and safety
    },
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error("Empty response from Gemini API");
  }

  // Parse and validate
  let parsed: StructuredEmergencyResponse;
  try {
    parsed = JSON.parse(responseText);
  } catch {
    // Try regex extraction if wrapped
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("Unable to parse structured JSON from Gemini response");
    }
  }

  // Ensure mandatory fields and valid urgency
  if (!parsed.incident || !Array.isArray(parsed.steps)) {
    throw new Error("Gemini response is missing mandatory fields");
  }

  // Normalize urgency
  if (!["low", "moderate", "high"].includes(parsed.urgency)) {
    parsed.urgency = "moderate";
  }

  // Double check high severity keywords to ensure conservative escalation
  const textToCheck = `${text} ${parsed.incident} ${parsed.summary}`.toLowerCase();
  const criticalKeywords = [
    "unconscious",
    "not responding",
    "collapsed",
    "heavy bleeding",
    "severe bleeding",
    "head trauma",
    "seizure",
    "chest pain",
    "choking",
    "can't breathe",
    "cannot breathe",
    "electric shock",
    "live wire",
    "fire",
    "smoke",
    "poison",
  ];

  if (criticalKeywords.some((kw) => textToCheck.includes(kw))) {
    parsed.urgency = "high";
    parsed.callEmergencyServices = true;
  }

  parsed.language = language;
  parsed.timestamp = new Date().toISOString();
  parsed.source = "ai";

  return parsed;
}

export async function translateEmergencyResponse(
  data: StructuredEmergencyResponse,
  targetLanguage: SupportedLanguage | string
): Promise<StructuredEmergencyResponse> {
  const ai = getGeminiClient();
  if (!ai) {
    return { ...data, language: targetLanguage };
  }

  const prompt = `Translate the following emergency first-response card into ${
    targetLanguage === "hi"
      ? "Hindi (Devanagari)"
      : targetLanguage === "hinglish"
      ? "Hinglish (Roman Hindi conversational)"
      : "English"
  }. 
Preserve all numbered steps, warnings, emergency contact names, and safety meaning. Do not hallucinate or change the urgency level.

Input JSON:
${JSON.stringify(data, null, 2)}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.7-flash",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: emergencySchema,
      temperature: 0.1,
    },
  });

  const text = response.text;
  if (!text) return { ...data, language: targetLanguage };

  try {
    const translated = JSON.parse(text);
    return {
      ...translated,
      urgency: data.urgency,
      callEmergencyServices: data.callEmergencyServices,
      language: targetLanguage,
      source: "ai",
      timestamp: new Date().toISOString(),
    };
  } catch {
    return { ...data, language: targetLanguage };
  }
}
