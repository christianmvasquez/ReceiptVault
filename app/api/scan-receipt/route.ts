import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image URL provided." },
        { status: 400 }
      );
    }

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                "Read this receipt. Return ONLY valid JSON in this exact format: {\"vendor\":\"\",\"amount\":0,\"category\":\"Meals\"}. Category must be one of Meals, Travel, Supplies, Equipment, Fuel, or Other.",
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      response_format: {
        type: "json_object",
      },
    });

    return NextResponse.json(
      JSON.parse(response.choices[0].message.content || "{}")
    );
  } catch (error) {
    console.error("===== OPENAI ERROR =====");
console.dir(error, { depth: null });
console.error("========================");
    return NextResponse.json(
      {
        error: "Failed to scan receipt.",
      },
      { status: 500 }
    );
  }
}