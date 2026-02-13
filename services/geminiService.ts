
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDivineEncouragement = async (levelName: string, situation: 'start' | 'low_health' | 'boss_fight') => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are Jambavan, the wise king of bears from the Ramayana. Give a brief (15-20 words) motivational advice to Hanuman who is currently in ${levelName}. The situation is: ${situation}. Use epic, ancient language.`,
      config: {
        temperature: 0.8,
        maxOutputTokens: 50,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The path is long, but your spirit is eternal, O Mighty Son of Vayu!";
  }
};

export const getDemonTaunt = async (levelName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a Rakshasa (demon) guarding the path to ${levelName}. Give a short, menacing taunt to Hanuman. Max 15 words.`,
      config: {
        temperature: 0.9,
      }
    });
    return response.text;
  } catch (error) {
    return "You shall not pass, Vanara! Lanka's walls are unbreakable.";
  }
};
