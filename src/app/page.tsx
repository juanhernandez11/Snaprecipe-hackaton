"use client";

import { useState } from "react";
import ImageCapture from "@/components/ImageCapture";
import IngredientsReview from "@/components/IngredientsReview";
import Preferences from "@/components/Preferences";
import RecipeResults from "@/components/RecipeResults";
import Header from "@/components/Header";

export type AppStep = "capture" | "ingredients" | "preferences" | "recipes";

export interface Recipe {
  name: string;
  time: string;
  difficulty: string;
  servings: string;
  ingredients: string[];
  steps: string[];
  tip: string;
}

export interface UserPreferences {
  time: string;
  dietary: string[];
  cuisine: string;
}

export default function Home() {
  const [step, setStep] = useState<AppStep>("capture");
  const [imageBase64, setImageBase64] = useState<string>("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleImageCaptured = async (base64: string) => {
    setImageBase64(base64);
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/detect-ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al detectar ingredientes");
      }

      setIngredients(data.ingredients);
      setStep("ingredients");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleIngredientsConfirmed = (confirmedIngredients: string[]) => {
    setIngredients(confirmedIngredients);
    setStep("preferences");
  };

  const handlePreferencesSubmit = async (prefs: UserPreferences) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/generate-recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients, preferences: prefs }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al generar recetas");
      }

      setRecipes(data.recipes);
      setStep("recipes");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("capture");
    setImageBase64("");
    setIngredients([]);
    setRecipes([]);
    setError("");
  };

  return (
    <main className="min-h-screen">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(["capture", "ingredients", "preferences", "recipes"] as AppStep[]).map(
            (s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step === s
                      ? "bg-orange-500 text-white scale-110"
                      : (["capture", "ingredients", "preferences", "recipes"].indexOf(step) > i)
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {["capture", "ingredients", "preferences", "recipes"].indexOf(step) > i ? "✓" : i + 1}
                </div>
                {i < 3 && (
                  <div
                    className={`w-8 h-0.5 ${
                      ["capture", "ingredients", "preferences", "recipes"].indexOf(step) > i
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            )
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4" />
            <p className="text-gray-600 text-lg">
              {step === "capture"
                ? "Analizando imagen con IA..."
                : "Generando recetas personalizadas..."}
            </p>
          </div>
        )}

        {/* Steps */}
        {!loading && step === "capture" && (
          <ImageCapture onImageCaptured={handleImageCaptured} />
        )}

        {!loading && step === "ingredients" && (
          <IngredientsReview
            ingredients={ingredients}
            onConfirm={handleIngredientsConfirmed}
            onBack={() => setStep("capture")}
          />
        )}

        {!loading && step === "preferences" && (
          <Preferences
            onSubmit={handlePreferencesSubmit}
            onBack={() => setStep("ingredients")}
          />
        )}

        {!loading && step === "recipes" && (
          <RecipeResults recipes={recipes} onReset={handleReset} />
        )}
      </div>
    </main>
  );
}
