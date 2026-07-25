import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export const maxDuration = 30;

function extractJSON(text: string): string | null {
  // Remove <think>...</think> blocks if present
  const cleaned = text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

  // Try to find a JSON object with "recipes" key
  const jsonMatch = cleaned.match(/\{[\s\S]*"recipes"[\s\S]*\}/);
  if (jsonMatch) {
    // Try to find the balanced braces
    let depth = 0;
    let start = -1;
    for (let i = 0; i < cleaned.length; i++) {
      if (cleaned[i] === "{") {
        if (depth === 0) start = i;
        depth++;
      } else if (cleaned[i] === "}") {
        depth--;
        if (depth === 0 && start !== -1) {
          const candidate = cleaned.substring(start, i + 1);
          if (candidate.includes('"recipes"')) {
            return candidate;
          }
        }
      }
    }
  }

  // Fallback: try the whole cleaned text as JSON
  if (cleaned.startsWith("{")) {
    return cleaned;
  }

  // Last resort: find content between first { and last }
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return cleaned.substring(firstBrace, lastBrace + 1);
  }

  return null;
}

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

    const { ingredients, preferences } = await request.json();

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json(
        { error: "No se proporcionaron ingredientes" },
        { status: 400 }
      );
    }

    const timeConstraint =
      preferences.time === "any"
        ? "sin límite de tiempo"
        : `máximo ${preferences.time} minutos`;

    const dietaryConstraint =
      preferences.dietary.length === 0
        ? "sin restricciones alimentarias"
        : `restricciones: ${preferences.dietary.join(", ")}`;

    const cuisineConstraint =
      preferences.cuisine === "any"
        ? "cualquier tipo de cocina"
        : `cocina ${preferences.cuisine}`;

    const prompt = `Eres un chef experto. Genera exactamente 3 recetas usando los siguientes ingredientes disponibles.

INGREDIENTES DISPONIBLES:
${ingredients.join(", ")}

PREFERENCIAS DEL USUARIO:
- Tiempo: ${timeConstraint}
- ${dietaryConstraint}
- Preferencia de cocina: ${cuisineConstraint}

REGLAS:
- Las recetas deben usar PRINCIPALMENTE los ingredientes listados.
- Puedes asumir que el usuario tiene ingredientes básicos (sal, pimienta, aceite, agua).
- Cada receta debe ser realista y fácil de seguir.
- Adapta las recetas a las restricciones alimentarias indicadas.
- Los pasos deben ser claros y concisos.

Responde con un JSON válido con este formato:
{
  "recipes": [
    {
      "name": "Nombre de la receta",
      "time": "X minutos",
      "difficulty": "Fácil|Media|Difícil",
      "servings": "X porciones",
      "ingredients": ["cantidad ingrediente1", "cantidad ingrediente2"],
      "steps": ["Paso 1 detallado", "Paso 2 detallado", "Paso 3 detallado"],
      "tip": "Un consejo útil para esta receta"
    }
  ]
}`;

    const chatCompletion = await groq.chat.completions.create({
      model: "qwen/qwen3.6-27b",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "";
    console.log("Groq recipes response (first 300 chars):", responseText.substring(0, 300));

    const jsonString = extractJSON(responseText);
    if (!jsonString) {
      console.error("Could not extract JSON from response:", responseText);
      return NextResponse.json(
        { error: "No se pudo parsear la respuesta de IA" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonString);

    return NextResponse.json({ recipes: parsed.recipes || [] });
  } catch (error: unknown) {
    const err = error as Error & { status?: number; message?: string };
    console.error("Error generating recipes:", err.message || err);

    if (err.status === 401) {
      return NextResponse.json(
        { error: "API key inválida. Verifica tu configuración." },
        { status: 500 }
      );
    }
    if (err.status === 429) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Espera un momento e intenta de nuevo." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: `Error al generar recetas: ${err.message || "Error desconocido"}` },
      { status: 500 }
    );
  }
}
