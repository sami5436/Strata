import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Override default border-radius to 0 (sharp corners)
    borderRadius: {
      none: "0",
      DEFAULT: "0",
    },
    extend: {
      // Industrial Brutalism Color Palette
      colors: {
        // Base colors
        background: "#FFFFFF",
        foreground: "#000000",
        
        // Primary colors
        "oil-black": "#1A1A1A",
        "concrete-gray": "#808080",
        
        // Accent/Alert colors
        "industrial-yellow": "#FFD500",
        "safety-red": "#E60000",
        "forest-green": "#228B22",
        
        // Utility
        white: "#FFFFFF",
        black: "#000000",
      },
      
      // Typography - JetBrains Mono for data, Inter for UI
      fontFamily: {
        mono: ["JetBrains Mono", "Geist Mono", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      
      // 8px grid system spacing
      spacing: {
        "grid-1": "8px",
        "grid-2": "16px",
        "grid-3": "24px",
        "grid-4": "32px",
        "grid-5": "40px",
        "grid-6": "48px",
        "grid-8": "64px",
        "grid-10": "80px",
        "grid-12": "96px",
        "sidebar": "240px",
      },
      
      // Thick borders
      borderWidth: {
        DEFAULT: "2px",
        "1": "1px",
        "2": "2px",
        "3": "3px",
        "4": "4px",
      },
      
      // Large metric font sizes
      fontSize: {
        "metric-xl": ["96px", { lineHeight: "1", fontWeight: "700" }],
        "metric-lg": ["72px", { lineHeight: "1", fontWeight: "700" }],
        "metric-md": ["48px", { lineHeight: "1", fontWeight: "700" }],
        "metric-sm": ["32px", { lineHeight: "1", fontWeight: "700" }],
        "label-lg": ["14px", { lineHeight: "1.2", fontWeight: "600", letterSpacing: "0.1em" }],
        "label-md": ["12px", { lineHeight: "1.2", fontWeight: "600", letterSpacing: "0.1em" }],
        "label-sm": ["10px", { lineHeight: "1.2", fontWeight: "600", letterSpacing: "0.1em" }],
      },
      
      // Box shadows - NONE (Industrial Brutalism has no shadows)
      boxShadow: {
        none: "none",
        DEFAULT: "none",
      },
    },
  },
  plugins: [],
};

export default config;
