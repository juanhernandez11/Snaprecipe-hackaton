"use client";

import { useState } from "react";
import type { Recipe } from "@/app/page";

interface Props {
  recipes: Recipe[];
  onReset: () => void;
}

export default function RecipeResults({ recipes, onReset }: Props) {
  const [expandedRecipe, setExpandedRecipe] = useState<number | null>(0);

  const toggleRecipe = (index: number) => {
    setExpandedRecipe(expandedRecipe === index ? null : index);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "fácil":
        return "bg-green-100 text-green-700";
      case "media":
        return "bg-yellow-100 text-yellow-700";
      case "difícil":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">
          🍽️ Recetas sugeridas
        </h2>
        <p className="text-gray-600">
          Hemos creado {recipes.length} recetas con tus ingredientes
        </p>
      </div>

      <div className="space-y-4">
        {recipes.map((recipe, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md overflow-hidden transition-all"
          >
            <button
              onClick={() => toggleRecipe(index)}
              className="w-full p-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800">
                  {recipe.name}
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="inline-flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                    ⏱️ {recipe.time}
                  </span>
                  <span
                    className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${getDifficultyColor(
                      recipe.difficulty
                    )}`}
                  >
                    📊 {recipe.difficulty}
                  </span>
                  <span className="inline-flex items-center text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
                    👥 {recipe.servings}
                  </span>
                </div>
              </div>
              <span className="text-2xl ml-3">
                {expandedRecipe === index ? "▲" : "▼"}
              </span>
            </button>

            {expandedRecipe === index && (
              <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
                {/* Ingredientes */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    📝 Ingredientes:
                  </h4>
                  <ul className="space-y-1">
                    {recipe.ingredients.map((ing, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-600 flex items-start gap-2"
                      >
                        <span className="text-green-500 mt-0.5">•</span>
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pasos */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    👨‍🍳 Preparación:
                  </h4>
                  <ol className="space-y-2">
                    {recipe.steps.map((step, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-600 flex items-start gap-3"
                      >
                        <span className="bg-orange-100 text-orange-600 font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-xs">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Tip */}
                {recipe.tip && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                    <p className="text-sm text-yellow-800">
                      💡 <strong>Tip:</strong> {recipe.tip}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onReset}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 px-8 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
      >
        📸 Escanear nuevos ingredientes
      </button>
    </div>
  );
}
