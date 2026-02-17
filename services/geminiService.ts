import { GoogleGenerativeAI } from "@google/generative-ai";
import { CreatureData } from "../types";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
// 2026 FIXED MODEL ID: Avoids the retired '1.5' 404 error
const MODEL_NAME = 'gemini-2.5-flash-image'; 

export const generateMonsterCard = async (creature: CreatureData): Promise<string | null> => {
  if (!creature.sketchBase64) throw new Error("No sketch provided");

  const base64Data = creature.sketchBase64.split(',')[1] || creature.sketchBase64;
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const prompt = `Generate a vertical TCG card for ${creature.name}. Element: ${creature.type}. HP: ${creature.hp}. Ability: ${creature.specialAbility}.`;

  try {
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [
          { text: prompt }, 
          { inlineData: { data: base64Data, mimeType: 'image/jpeg' } }
        ]
      }]
    });

    const response = await result.response;
    return extractImageFromResponse(response);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const editMonsterCard = async (currentImageBase64: string, editInstructions: string): Promise<string | null> => {
  const base64Data = currentImageBase64.split(',')[1] || currentImageBase64;
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  try {
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [
          { text: `Edit this card: ${editInstructions}` },
          { inlineData: { data: base64Data, mimeType: "image/png" } }
        ]
      }]
    });

    const response = await result.response;
    return extractImageFromResponse(response);
  } catch (error) {
    console.error("Edit Error:", error);
    throw error;
  }
};

const extractImageFromResponse = (response: any): string | null => {
  const parts = response.candidates?.[0]?.content?.parts;
  if (parts) {
    for (const part of parts) {
      if (part.inlineData?.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  return null;
};
