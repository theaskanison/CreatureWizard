import { GoogleGenerativeAI } from "@google/generative-ai";
import { CreatureData } from "../types";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
// 2026 update: Use the specific stable alias
const MODEL_NAME = 'gemini-2.0-flash-exp'; 

export const generateMonsterCard = async (creature: CreatureData): Promise<string | null> => {
  if (!creature.sketchBase64) throw new Error("No sketch provided");
  const base64Data = creature.sketchBase64.split(',')[1] || creature.sketchBase64;
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  try {
    // This nested structure is the ONLY way to avoid the 404 route error in 2026
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [
          { text: `Generate a vertical TCG card for ${creature.name}. Element: ${creature.type}.` },
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

const extractImageFromResponse = (response: any): string | null => {
  const parts = response.candidates?.[0]?.content?.parts;
  if (parts) {
    for (const part of parts) {
      if (part.inlineData?.data) return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};
