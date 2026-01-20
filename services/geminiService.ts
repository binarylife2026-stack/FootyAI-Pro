
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse, MatchInput, GroundingSource } from "../types";

export const analyzeMatch = async (input: MatchInput): Promise<AnalysisResponse> => {
  // Create a new instance right before the call to ensure it uses the latest selected key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-pro-preview';
  
  const prompt = `
    Analyze the football match: ${input.homeTeam} vs ${input.awayTeam} ${input.league ? `(${input.league})` : ''}.
    As the World's Most Advanced Football Analytics AI, you must provide 70-80% accurate predictions.
    
    STEP 1: Use Google Search to find LIVE data from sports news, H2H databases, and official league sites.
    STEP 2: Analyze the following categories with extreme precision.
    
    OUTPUT RULES:
    - explanation: Bengali (বাংলায় বিস্তারিত ব্যাখ্যা দিন).
    - marketName: English.
    - Analyze EVERY option provided below without exception.

    MANDATORY OPTIONS:
    ১. ফলাফল ও মূল বাজি: Home/Away Win, Double Chance, Draw in at least one half, Win by margin (1,2,3,4+).
    ২. গোল ও বিটিএস: Total Goals (O/U), Handicap, Goal count, BTS, Winner+BTS, Winner+O/U, 1st Goal team, 1st Goal type (Kick), Goal in both halves, Goals in a row (2,3,4,5), One-sided scoring.
    ৩. বিশেষ ঘটনা: Goal outside box, Header goal, Goal after corner (10s), Substitute to score, Injury time goal, Double Chance + BTS.
    ৪. শৃঙ্খলা ও ফাউল: Red Card, Penalty/Red Card combo, Penalty Awarded, No Penalty/Red Card, Yellow Card (O/U), Both teams 1+ card, Foul winner.
    ৫. সেট পিস ও স্ট্যাটস: Corner Winner, Total Corners (O/U), Last Corner Time, Race to 7/9 Corners, Shots on Target (O/U & Winner), Offside (O/U), Goal Kicks winner, More Saves, Shots towards bar/post.
    ৬. টেকনোলজি ও বিবিধ: VAR Checked, Medical team entry (2+), Ball in net but no goal.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      homeTeam: { type: Type.STRING },
      awayTeam: { type: Type.STRING },
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
    required: ["homeTeam", "awayTeam", "categories"]
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
    if (!text) throw new Error("Analysis failed. Please try again.");

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
    console.error("Analysis Error:", error);
    // If the entity is not found, it usually means a key selection issue
    if (error.message?.includes("not found") || error.message?.includes("API_KEY")) {
      throw new Error("REAUTH_NEEDED");
    }
    throw error;
  }
};
