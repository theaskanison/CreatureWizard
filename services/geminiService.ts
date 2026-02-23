import { GoogleGenAI } from "@google/genai";
import { CreatureData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Using gemini-2.5-flash-image for multimodal capabilities (sketch-to-image)
const MODEL_NAME = 'gemini-2.5-flash-image';

export const generateMonsterCard = async (creature: CreatureData): Promise<string | null> => {
  if (!creature.sketchBase64) {
    throw new Error("No sketch provided");
  }

  // Extract base64 data without the prefix if present
  const base64Data = creature.sketchBase64.split(',')[1] || creature.sketchBase64;

  const colorInstruction = creature.selectedColors.length > 0 
    ? `Primary Colors to use: ${creature.selectedColors.join(', ')}. Color Harmony Strategy: ${creature.colorHarmony}.`
    : 'Use colors that match the element type.';

  const prompt = `
    Generate a vertical Trading Card Game card (3:4 aspect ratio) based on the attached sketch.
    
    Card Data to Display (Must be legible):
    - Name: "${creature.name}" (Place at the top)
    - HP: "${creature.hp} HP" (Place at the top right)
    - Element: "${creature.type}" (Theme the card border/background around this)
    - Attack Move: "${creature.specialAbility}" (Place in the lower text box)
    - Damage: "${creature.specialAbilityDamage}" (Place next to the attack)
    - Flavor Text: "${creature.description}" (Small text at the bottom)
    
    Design Instructions:
    1. ORIENTATION: Vertical (Portrait). The card must be taller than it is wide.
    2. LAYOUT: Standard monster card layout (like Pokemon).
       - Top Header: Name and HP.
       - Center: Large, vibrant illustration of the monster.
       - Bottom Panel: Attack details, Damage number, and Description.
    3. ART STYLE: High-quality, vibrant 3D render style, similar to popular monster collecting card games.
    4. SKETCH INTERPRETATION: ${creature.sketchFeatures}. The "scribbles" in the sketch should be interpreted as textures, energy, or specific body parts as described.
    5. COLORS: ${colorInstruction}

    IMPORTANT PRINTING INSTRUCTIONS:
    - The card edges must be CLEAN, SOLID, and FLAT. 
    - DO NOT ADD grunge, dirt, wear, tear, or realistic paper texture to the card border/frame.
    - This image will be printed and laminated, so it needs to look like a digital vector asset (pristine condition), not a photo of an old card.
    - NO background surface (no table, wood, or paper backdrop).
    - NO perspective tilt; keep the card flat and front-facing (2D view).
    - Crop perfectly to the card edge.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/jpeg', // Assuming JPEG/PNG from canvas/input
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: '3:4'
        }
      }
    });

    return extractImageFromResponse(response);
  } catch (error) {
    console.error("Error generating card:", error);
    throw error;
  }
};

export const editMonsterCard = async (currentImageBase64: string, editInstructions: string): Promise<string | null> => {
  const base64Data = currentImageBase64.split(',')[1] || currentImageBase64;

  const prompt = `
    Edit this trading card image based on: "${editInstructions}".
    
    Instructions:
    - Maintain the Vertical (Portrait) aspect ratio (3:4).
    - Keep the "Trading Card" layout with clear text sections for Name, HP, and Attack.
    - Ensure the text remains legible and consistent with the previous design.
    - If the user asks to change the color, element, or features, update the monster illustration accordingly.
    - Maintain the high-quality, vibrant 3D art style.
    
    IMPORTANT PRINTING INSTRUCTIONS:
    - The output must remain perfectly cropped to the card edges.
    - Clean, solid borders. No grunge texture. No table background.
    - Keep the view flat and front-facing (digital asset style).
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/png',
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: '3:4'
        }
      }
    });

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