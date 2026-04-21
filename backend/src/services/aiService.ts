import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface WasteClassification {
  material_name: string;
  category: 'Organic' | 'Textile' | 'Plastic' | 'Metal' | 'Cardboard' | 'Glass' | 'Other';
  suggested_use: string;
}

/**
 * Analyzes an image of waste and returns structured data for upcycling.
 * @param base64Image - The image data from the frontend (without the data:image/jpeg;base64, prefix)
 */
export const classifyWaste = async (base64Image: string): Promise<WasteClassification> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a sustainability and materials expert. Always return responses in valid JSON."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this image. Identify the primary waste material. 
              Categorize it as exactly one of these strings: "Organic", "Textile", "Plastic", "Metal", "Cardboard", "Glass", or "Other". 
              Suggest one specific, sustainable upcycled B2B product that can be made from it. 
              Return ONLY a JSON object with the keys: "material_name", "category", and "suggested_use".`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
    });

    const content = response.choices[0]?.message.content;
    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    const result = JSON.parse(content) as WasteClassification;
    return result;
  } catch (error) {
    console.error("Error calling OpenAI Vision API:", error);
    throw error;
  }
};
