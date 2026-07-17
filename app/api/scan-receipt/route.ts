import OpenAI from "openai";
import { NextResponse } from "next/server";

const categories = ["Meals", "Travel", "Supplies", "Equipment", "Fuel", "Other"];

function getScanErrorMessage(error: unknown) {
  if (error instanceof OpenAI.APIError) {
    if (error.status === 401) {
      return "OpenAI rejected the API key. Check OPENAI_API_KEY in Vercel.";
    }

    if (error.status === 403) {
      return "This OpenAI API key does not have access to the scan model.";
    }

    if (error.status === 429) {
      return "OpenAI billing or rate limit blocked the scan. Check your API balance and limits.";
    }

    if (error.status === 400) {
      return "OpenAI could not read this image. Try a clearer JPG or PNG receipt photo.";
    }
  }

  return "Failed to scan receipt.";
}

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image URL provided." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured." },
        { status: 500 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                "Read this receipt. Return ONLY valid JSON in this exact format: {\"vendor\":\"\",\"amount\":0,\"category\":\"Meals\"}. Use the merchant name for vendor. Use the final total for amount. Category must be one of Meals, Travel, Supplies, Equipment, Fuel, or Other.",
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

    const parsed = JSON.parse(response.choices[0].message.content || "{}");
    const category = categories.includes(parsed.category)
      ? parsed.category
      : "Other";

    return NextResponse.json({
      vendor: String(parsed.vendor || ""),
      amount: Number(parsed.amount || 0),
      category,
    });
  } catch (error) {
    console.error("===== OPENAI ERROR =====");
    console.dir(error, { depth: null });
    console.error("========================");
    return NextResponse.json(
      {
        error: getScanErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
