"use client";

import { useState } from "react";

interface Props {
  ingredients: string[];
  onConfirm: (ingredients: string[]) => void;
  onBack: () => void;
}

export default function IngredientsReview({ ingredients, onConfirm, onBack }: Props) {
  const [editableIngredients, setEditableIngredients] = useState<string[]>(ingredients);
  const [newIngredient, setNewIngredient] = useState("");

  const removeIngredient = (index: number) => {
    setEditableIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setEditableIngredients((prev) => [...prev, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addIngredient();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">
          🥗 Ingredientes detectados
        </h2>
        <p className="text-gray-600">
          Revisa los ingredientes que hemos identificado. Puedes editar la lista.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          {editableIngredients.map((ingredient, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium"
            >
              {ingredient}
              <button
                onClick={() => removeIngredient(index)}
                className="ml-1 text-green-600 hover:text-red-500 transition-colors"
                aria-label={`Eliminar ${ingredient}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>

        {editableIngredients.length === 0 && (
          <p className="text-center text-gray-400 py-4">
            No hay ingredientes. Agrega algunos manualmente.
          </p>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Agregar ingrediente..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
          />
          <button
            onClick={addIngredient}
            className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors font-medium text-sm"
          >
            + Agregar
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
        >
          ← Volver
        </button>
        <button
          onClick={() => onConfirm(editableIngredients)}
          disabled={editableIngredients.length === 0}
          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-6 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuar →
        </button>
      </div>
    </div>
  );
}
