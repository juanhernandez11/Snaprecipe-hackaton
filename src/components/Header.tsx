"use client";

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-white text-xl">
          📸
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">SnapRecipe</h1>
          <p className="text-xs text-gray-500">Escanea tu nevera, obtén recetas</p>
        </div>
      </div>
    </header>
  );
}
