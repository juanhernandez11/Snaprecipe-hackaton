import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not configured");
      return NextResponse.json(
        { error: "API key no configurada" },
        { status: 500 }
      );
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { error: "No se proporcionó imagen" },
        { status: 400 }
      );
    }

    // Check image size (base64 string length)
    const imageSizeKB = Math.round((image.length * 3) / 4 / 1024);
    console.log(`Image size: ~${imageSizeKB}KB`);

    if (imageSizeKB > 4000) {
      return NextResponse.json(
        { error: "La imagen es demasiado grande. Intenta con una foto más pequeña." },
        { status: 400 }
      );
    }

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analiza esta imagen de ingredientes de cocina. Identifica todos los ingredientes visibles y devuélvelos en formato JSON como un array de strings.

IMPORTANTE:
- Solo lista ingredientes de comida/cocina que puedas identificar claramente.
- Usa nombres en español.
- Sé específico (ej: "tomate rojo" en vez de solo "tomate" si puedes distinguirlo).
- Si ves envases o productos, menciona el producto (ej: "leche", "salsa de soya").

Responde ÚNICAMENTE con un JSON válido en este formato exacto:
{"ingredients": ["ingrediente1", "ingrediente2", "ingrediente3"]}`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${image}`,
              },
            },
          ],
        },
      ],
      temperature: 0.3,
      max_tokens: 1024,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "";
    console.log("Groq response:", responseText.substring(0, 200));

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Could not parse JSON from response:", responseText);
      return NextResponse.json(
        { error: "No se pudo parsear la respuesta de IA" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const ingredients: string[] = parsed.ingredients || [];

    return NextResponse.json({ ingredients });
  } catch (error: unknown) {
    const err = error as Error & { status?: number; message?: string };
    console.error("Error detecting ingredients:", err.message || err);

    // Provide more specific error messages
    if (err.status === 401) {
      return NextResponse.json(
        { error: "API key inválida. Verifica tu configuración." },
        { status: 500 }
      );
    }
    if (err.status === 413 || err.message?.includes("too large")) {
      return NextResponse.json(
        { error: "La imagen es demasiado grande. Intenta con una más pequeña." },
        { status: 400 }
      );
    }
    if (err.status === 429) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Espera un momento e intenta de nuevo." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: `Error al procesar la imagen: ${err.message || "Error desconocido"}` },
      { status: 500 }
    );
  }
}
