import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "No se proporcionó imagen" },
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

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "No se pudo parsear la respuesta de IA" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const ingredients: string[] = parsed.ingredients || [];

    return NextResponse.json({ ingredients });
  } catch (error) {
    console.error("Error detecting ingredients:", error);
    return NextResponse.json(
      { error: "Error al procesar la imagen" },
      { status: 500 }
    );
  }
}
