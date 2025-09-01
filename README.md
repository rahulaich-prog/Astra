# Astra

A modern React + TypeScript frontend application built with Vite featuring 3D visualizations and interactive components.

## Features

- 3D Globe visualization with Spline
- Interactive 3D Maps for India
- Radar visualization components
- Signal analysis tools
- Modern UI with Tailwind CSS
- TypeScript for type safety

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js, React Three Fiber, Spline
- **Animations**: React Spring
- **Code Quality**: ESLint + TypeScript ESLint

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # React components
│   ├── India3DMap.tsx   # 3D map component
│   ├── Radar3D.tsx      # 3D radar visualization
│   ├── RadarEffects.tsx # Radar effects component
│   ├── SignalAnalysis.tsx # Signal analysis tools
│   └── SplineGlobe.tsx  # 3D globe component
├── lib/                 # Utility functions
└── assets/             # Static assets
```
