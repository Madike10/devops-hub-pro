
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const askGemini = async (question: string) => {
  if (!API_KEY) {
    throw new Error("L'API Key est manquante. Veuillez vérifier votre configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: question,
      config: {
        systemInstruction: `Vous êtes un expert senior en DevOps. Répondez de manière professionnelle, structurée et précise. Utilisez du Markdown pour le formatage. Si la question n'est pas liée au DevOps ou à l'informatique, rappelez gentiment votre spécialité. Répondez en français.`,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Erreur Gemini API:", error);
    throw error;
  }
};
