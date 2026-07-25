"use client";

import { useState } from "react";
import type { UserPreferences } from "@/app/page";

interface Props {
  onSubmit: (prefs: UserPreferences) => void;
  onBack: () => void;
}

const DIETARY_OPTIONS = [
  { id: "ninguna", label: "Sin restricciones", emoji: "🍽️" },
  { id: "vegetariano", label: "Vegetariano", emoji: "🥬" },
  { id: "vegano", label: "Vegano", emoji: "🌱" },
  { id: "sin-gluten", label: "Sin gluten", emoji: "🌾" },
  { id: "sin-lactosa", label: "Sin lactosa", emoji: "🥛" },
  { id: "keto", label: "Keto", emoji: "🥑" },
];

const TIME_OPTIONS = [
  { value: "15", label: "Rápido (15 min)", emoji: "⚡" },
  { value: "30", label: "Normal (30 min)", emoji: "⏱️" },
  { value: "60", label: "Con calma (1 hora)", emoji: "🍳" },
  { value: "any", label: "Sin límite", emoji: "👨‍🍳" },
];

const CUISINE_OPTIONS = [
  { value: "any", label: "Cualquiera", emoji: "🌍" },
  { value: "mexicana", label: "Mexicana", emoji: "🌮" },
  { value: "italiana", label: "Italiana", emoji: "🍝" },
  { value: "asiatica", label: "Asiática", emoji: "🍜" },
  { value: "mediterranea", label: "Mediterránea", emoji: "🫒" },
  { value: "americana", label: "Americana", emoji: "🍔" },
];

export default function Preferences({ onSubmit, onBack }: Props) {
  const [time, setTime] = useState("30");
  const [dietary, setDietary] = useState<string[]>([]);
  const [cuisine, setCuisine] = useState("any");

  const toggleDietary = (id: string) => {
    if (id === "ninguna") {
      setDietary([]);
      return;
    }
    setDietary((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    onSubmit({ time, dietary, cuisine });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">
          ⚙️ Tus preferencias
        </h2>
        <p className="text-gray-600">
          Personaliza las recetas según tus necesidades
        </p>
      </div>

      {/* Tiempo disponible */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-3">
        <h3 className="font-semibold text-gray-700">⏰ Tiempo disponible</h3>
        <div className="grid grid-cols-2 gap-2">
          {TIME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTime(opt.value)}
              className={`p-3 rounded-xl text-sm font-medium transition-all ${
                time === opt.value
                  ? "bg-orange-100 border-2 border-orange-400 text-orange-800"
                  : "bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100"
              }`}
            >
              {opt.emoji} {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Restricciones alimentarias */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-3">
        <h3 className="font-semibold text-gray-700">🥗 Restricciones alimentarias</h3>
        <div className="grid grid-cols-2 gap-2">
          {DIETARY_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => toggleDietary(opt.id)}
              className={`p-3 rounded-xl text-sm font-medium transition-all ${
                opt.id === "ninguna" && dietary.length === 0
                  ? "bg-orange-100 border-2 border-orange-400 text-orange-800"
                  : dietary.includes(opt.id)
                  ? "bg-orange-100 border-2 border-orange-400 text-orange-800"
                  : "bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100"
              }`}
            >
              {opt.emoji} {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tipo de cocina */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-3">
        <h3 className="font-semibold text-gray-700">🍴 Tipo de cocina</h3>
        <div className="grid grid-cols-2 gap-2">
          {CUISINE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setCuisine(opt.value)}
              className={`p-3 rounded-xl text-sm font-medium transition-all ${
                cuisine === opt.value
                  ? "bg-orange-100 border-2 border-orange-400 text-orange-800"
                  : "bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100"
              }`}
            >
              {opt.emoji} {opt.label}
            </button>
          ))}
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
          onClick={handleSubmit}
          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-6 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
        >
          🍳 Generar recetas
        </button>
      </div>
    </div>
  );
}
