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
        // Adding a custom purple color for easy reference if needed outside of primary
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-slow": "spin-slow 3s linear infinite",
        "background-pan": "background-pan 10s ease infinite",
        "text-glitch": "text-glitch 0.5s infinite alternate",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};