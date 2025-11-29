import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askFarmAssistant = async (
  question: string,
  contextData: string
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const systemPrompt = `You are an expert Veterinary and Goat Farm Management Assistant. 
    You help farmers with advice on goat health, breeding, nutrition, and analyzing farm data.
    The user will provide a question and sometimes JSON data about their herd.
    
    Guidelines:
    - Provide practical, actionable advice.
    - If analyzing data, summarize key trends (e.g., "Weight gain is steady", "Expenses are rising").
    - If the query is medical, always include a disclaimer: "Consult a local vet for a definitive diagnosis."
    - Be concise and professional.
    
    Current Herd Context:
    ${contextData}
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: question,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    return response.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the satellite. Please check your connection or API key.";
  }
};
