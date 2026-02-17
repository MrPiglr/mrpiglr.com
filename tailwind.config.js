/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Brand colors: Purple primary + Gold & Cyan secondaries
        purple: {
          50: '#fdf4ff',
          100: '#fbe9ff',
          200: '#f8d6ff',
          300: '#f3b0ff',
          400: '#ea7dff',
          500: '#dd45ff', // A vibrant purple
          600: '#c513e6',
          700: '#a30ea6',
          800: '#840a85',
          900: '#6d076b',
          950: '#460144',
        },
        gold: {
          50: '#FFFBF0',
          100: '#FFF8E1',
          200: '#FFECB3',
          300: '#FFE082',
          400: '#FFD54F',
          500: '#FFCA28',
          600: '#FFC107',
          700: '#FFB300',
          800: '#FFA000',
          900: '#FF8F00',
        },
        cyan: {
          50: '#E0F7FA',
          100: '#B2EBF2',
          200: '#80DEEA',
          300: '#4DD0E1',
          400: '#26C6DA',
          500: '#00BCD4',
          600: '#00ACC1',
          700: '#0097A7',
          800: '#00838F',
          900: '#006064',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "background-pan": {
          "0%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
          "100%": { "background-position": "0% 50%" },
        },
        "text-glitch": {
          "0%, 100%": {
            "clip-path": "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            transform: "translate(0, 0)",
          },
          "20%": {
            "clip-path": "polygon(0 0, 100% 0, 100% 33%, 0 33%)",
            transform: "translate(-2px, -2px)",
          },
          "40%": {
            "clip-path": "polygon(0 66%, 100% 66%, 100% 100%, 0 100%)",
            transform: "translate(2px, 2px)",
          },
          "60%": {
            "clip-path": "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
            transform: "translate(-1px, 1px)",
          },
          "80%": {
            "clip-path": "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
            transform: "translate(1px, -1px)",
          },
        },
        // New animations for aethex-style effects
        "glow-pulse": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        "card-glow": {
          "0%": { boxShadow: "0 0 20px rgba(154, 71, 255, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(154, 71, 255, 0.6)" },
          "100%": { boxShadow: "0 0 20px rgba(154, 71, 255, 0.3)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-slow": "spin-slow 3s linear infinite",
        "background-pan": "background-pan 10s ease infinite",
        "text-glitch": "text-glitch 0.5s infinite alternate",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "card-glow": "card-glow 3s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-up": "slide-up 0.6s ease-out",
        "gradient-shift": "gradient-shift 8s ease infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};