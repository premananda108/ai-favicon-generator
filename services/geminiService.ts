
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Generates an icon using the Imagen model.
 * @param userPrompt - The user's description of the icon.
 * @returns A base64 encoded string of the generated PNG image.
 */
export const generateIcon = async (userPrompt: string): Promise<string> => {
  const fullPrompt = `A professional, modern, square app icon. Vector art style. Centered object. The icon should represent: "${userPrompt}". The background should be a simple, solid color or a very subtle gradient that complements the main object. The icon must be clear, simple, and easily recognizable at small sizes. No text unless specified.`;

  const response = await ai.models.generateImages({
    model: 'imagen-3.0-generate-002',
    prompt: fullPrompt,
    config: { 
      numberOfImages: 1, 
      outputMimeType: 'image/png' 
    },
  });

  if (!response.generatedImages || response.generatedImages.length === 0) {
    throw new Error("API did not return any images.");
  }
  
  const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
  return base64ImageBytes;
};
