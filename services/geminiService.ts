import { GoogleGenerativeAI } from "@google/generative-ai";
import { CreatureData } from "../types";

// Initialize the AI with your Vercel Environment Variable
const ai = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

// Use a stable public model name
const MODEL_NAME = 'gemini-1.5-flash';

export const generateMonsterCard = async (creature: CreatureData): Promise<string | null> => {
  if (!creature.sketchBase64) {
    throw new Error("No sketch provided");
  }

  const base64Data = creature.sketchBase64.split(',')[1] || creature.sketchBase64;
  const model = ai.getGenerativeModel({ model: MODEL_NAME });

  const colorInstruction = creature.selectedColors.length > 0 
    ? `Primary Colors to use: ${creature.selectedColors.join(', ')}. Color Harmony Strategy: ${creature.colorHarmony}.`
    : 'Use colors that match the element type.';

  const prompt = `
    Generate a vertical Trading Card Game card (3:4 aspect ratio) based on the attached sketch.
    
    Card Data:
    - Name: "${creature.name}"
    - HP: "${creature.hp} HP"
    - Element: "${creature.type}"
    - Attack Move: "${creature.specialAbility}"
    - Damage: "${creature.specialAbilityDamage}"
    - Flavor Text: "${creature.description}"
    
    Design Instructions:
    1. ORIENTATION: Vertical (3:4 aspect ratio).
    2. LAYOUT: Standard monster card (Name/HP at top, illustration center, attack/desc bottom).
    3. ART STYLE: High-quality, vibrant 3D render.
    4. SKETCH INTERPRETATION: ${creature.sketchFeatures}.
    5. COLORS: ${colorInstruction}
  `;

  try {
    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          data: base64Data,
          mimeType: 'image/jpeg',
        },
      },
    ]);

    const response = await result.response;
    return extractImageFromResponse(response);
  } catch (error) {
    console.error("Error generating card:", error);
    throw error;
  }
};

export const editMonsterCard = async (currentImageBase64: string, editInstructions: string): Promise<string | null> => {
  const base64Data = currentImageBase64.split(',')[1] || currentImageBase64;
  const model = ai.getGenerativeModel({ model: MODEL_NAME });

  const prompt = `Edit this trading card image based on: "${editInstructions}". Keep 3:4 aspect ratio and card layout.`;

  try {
    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/png",
        },
      },
    ]);

    const response = await result.response;
    return extractImageFromResponse(response);
  } catch (error) {
    console.error("Error editing card:", error);
    throw error;
  }
};

const extractImageFromResponse = (response: any): string | null => {
  const parts = response.candidates?.[0]?.content?.parts;
  if (parts) {
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  return null;
};
