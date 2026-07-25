# 📸 SnapRecipe - Escanea tu nevera, obtén recetas

> Hackathon Kiro 2026

## 🎯 Problema

Llegas a casa cansado, abres la nevera y no sabes qué cocinar con lo que tienes. Terminas pidiendo comida a domicilio o desperdiciando ingredientes.

## 💡 Solución

**SnapRecipe** usa la cámara de tu dispositivo para fotografiar los ingredientes que tienes. La app los identifica con IA y te sugiere recetas personalizadas según tus preferencias, tiempo disponible y restricciones alimentarias.

## 🚀 Demo en línea

🔗 [snap-recipe.vercel.app](https://snap-recipe.vercel.app)

## ✨ Características

- 📷 **Captura de imagen** - Toma una foto o sube una imagen de tus ingredientes
- 🤖 **Detección con IA** - Identifica automáticamente los ingredientes usando visión artificial
- ✏️ **Edición manual** - Revisa y ajusta los ingredientes detectados
- ⚙️ **Personalización** - Configura tiempo disponible, restricciones alimentarias y tipo de cocina
- 🍳 **Recetas inteligentes** - Genera 3 recetas personalizadas con pasos detallados
- 📱 **Mobile-first** - Diseñado para usarse desde el celular

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│          Next.js + React + TailwindCSS          │
│                                                  │
│  ┌──────────┐  ┌───────────┐  ┌─────────────┐  │
│  │ Captura  │→ │ Revisión  │→ │Preferencias │  │
│  │ de imagen│  │ingredientes│  │  usuario    │  │
│  └──────────┘  └───────────┘  └─────────────┘  │
└────────────────────────┬────────────────────────┘
                         │ API Routes
┌────────────────────────▼────────────────────────┐
│                   Backend                        │
│             Next.js API Routes                   │
│                                                  │
│  ┌──────────────────┐  ┌─────────────────────┐  │
│  │/api/detect-      │  │/api/generate-       │  │
│  │  ingredients     │  │  recipes            │  │
│  └────────┬─────────┘  └──────────┬──────────┘  │
└───────────┼────────────────────────┼────────────┘
            │                        │
┌───────────▼────────────────────────▼────────────┐
│                  Groq API                        │
│        llama-4-scout-17b-16e-instruct           │
│         (Vision + Text Generation)               │
└─────────────────────────────────────────────────┘
```

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **Next.js 16** | Framework fullstack (App Router) |
| **React 19** | UI Components |
| **TypeScript** | Type safety |
| **TailwindCSS 4** | Estilos |
| **Groq API** | IA (Vision + Generación de texto) |
| **Vercel** | Despliegue |

## 📦 Instalación local

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/snap-recipe.git
cd snap-recipe

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local y agregar tu GROQ_API_KEY

# Ejecutar en desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🔑 Variables de entorno

| Variable | Descripción |
|---|---|
| `GROQ_API_KEY` | API Key de Groq ([console.groq.com](https://console.groq.com)) |

## 📱 Flujo de uso

1. **Captura** → Toma una foto de tus ingredientes o sube una imagen
2. **Revisión** → La IA detecta los ingredientes, puedes editar la lista
3. **Preferencias** → Elige tiempo, restricciones y tipo de cocina
4. **Recetas** → Obtén 3 recetas personalizadas con pasos detallados

## 🧑‍💻 Estructura del proyecto

```
snap-recipe/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── detect-ingredients/route.ts   # API: Detección con IA Vision
│   │   │   └── generate-recipes/route.ts     # API: Generación de recetas
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                          # Página principal (flujo)
│   └── components/
│       ├── Header.tsx
│       ├── ImageCapture.tsx                  # Captura/subida de imagen
│       ├── IngredientsReview.tsx             # Revisión de ingredientes
│       ├── Preferences.tsx                   # Preferencias del usuario
│       └── RecipeResults.tsx                 # Visualización de recetas
├── .env.example
├── package.json
└── README.md
```

## 🚀 Despliegue

El proyecto está desplegado en **Vercel**:

1. Conecta tu repositorio de GitHub a Vercel
2. Agrega la variable de entorno `GROQ_API_KEY`
3. Deploy automático con cada push

## 👥 Equipo

- Desarrollado para el **Hackathon Kiro 2026**

## 📄 Licencia

MIT
