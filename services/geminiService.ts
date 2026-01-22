
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse, MatchInput, GroundingSource } from "../types";

export const analyzeMatch = async (input: MatchInput): Promise<AnalysisResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-pro-preview';
  
  const sportContext = {
    football: "Focus on goals, corners, VAR, cards, and H2H.",
    cricket: "Focus on pitch reports, toss impact, wickets, runs per over, and ICC rankings.",
    basketball: "Focus on points per quarter, rebounds, free throws, and player match-ups.",
    tennis: "Focus on surface (clay/grass), aces, break point conversion, and set history.",
    hockey: "Focus on power plays, penalty corners, periods, and save percentages.",
    baseball: "Focus on innings, home runs, strikeouts, and bullpen depth.",
    "table tennis": "Focus on serve advantage, game momentum, and world rankings."
  };

  const prompt = `
    Analyze the ${input.sport} match: ${input.homeTeam} vs ${input.awayTeam} ${input.league ? `(${input.league})` : ''}.
    You are the World's Most Advanced Multi-Sport Analytics AI. Goal: 70-80% accuracy.
    
    SPORT SPECIFIC FOCUS: ${sportContext[input.sport.toLowerCase() as keyof typeof sportContext] || "General tactical analysis."}
    
    STEP 1: Use Google Search to find LIVE data (recent form, injuries, weather/pitch, and H2H).
    STEP 2: Analyze ALL betting markets relevant to ${input.sport}.
    
    OUTPUT RULES:
    - explanation: Bengali (বাংলায় বিস্তারিত ও যৌক্তিক ব্যাখ্যা দিন).
    - marketName: English.
    - categories: Organize into 4-6 logical categories for this sport.
    
    MARKETS TO COVER (Adapt for ${input.sport}):
    - Main Results (Winner, Handicap, Double Chance).
    - Scoring (Total Points/Goals/Runs, Over/Under, Individual counts).
    - Discipline/Events (Cards, Wickets, Fouls, VAR, Review).
    - Set-pieces/Specifics (Corners, Innings, Sets, Quarters, Free throws).
    - Special/Rare (Injury time events, Substitute impact, Goal/Point type).
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      homeTeam: { type: Type.STRING },
      awayTeam: { type: Type.STRING },
      sport: { type: Type.STRING },
      categories: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  marketName: { type: Type.STRING },
                  probability: { type: Type.NUMBER },
                  explanation: { type: Type.STRING }
                },
                required: ["marketName", "probability", "explanation"]
              }
            }
          },
          required: ["title", "items"]
        }
      }
    },
    required: ["homeTeam", "awayTeam", "categories", "sport"]
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Analysis engine failed to produce a report.");

    const parsedData = JSON.parse(text) as AnalysisResponse;

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      const sources: GroundingSource[] = groundingChunks
        .filter((chunk: any) => chunk.web)
        .map((chunk: any) => ({
          title: chunk.web.title || "Web Source",
          uri: chunk.web.uri
        }));
      parsedData.sources = Array.from(new Map(sources.map(s => [s.uri, s])).values());
    }

    return parsedData;
  } catch (error: any) {
    if (error.message?.includes("not found") || error.message?.includes("API_KEY")) {
      throw new Error("REAUTH_NEEDED");
    }
    throw error;
  }
};
