import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
  prefix: "",
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        neuro: {
          50: "hsl(var(--neuro-50))",
          100: "hsl(var(--neuro-100))",
          200: "hsl(var(--neuro-200))",
          300: "hsl(var(--neuro-300))",
          400: "hsl(var(--neuro-400))",
          500: "hsl(var(--neuro-500))",
          600: "hsl(var(--neuro-600))",
          700: "hsl(var(--neuro-700))",
          800: "hsl(var(--neuro-800))",
          900: "hsl(var(--neuro-900))",
          950: "hsl(var(--neuro-950))",
        },
        electric: {
          50: "hsl(var(--electric-50))",
          100: "hsl(var(--electric-100))",
          200: "hsl(var(--electric-200))",
          300: "hsl(var(--electric-300))",
          400: "hsl(var(--electric-400))",
          500: "hsl(var(--electric-500))",
          600: "hsl(var(--electric-600))",
          700: "hsl(var(--electric-700))",
          800: "hsl(var(--electric-800))",
          900: "hsl(var(--electric-900))",
          950: "hsl(var(--electric-950))",
        },
        glass: {
          light: "hsl(var(--glass-light))",
          dark: "hsl(var(--glass-dark))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "neuro-gradient":
          "linear-gradient(135deg, hsl(var(--neuro-500)), hsl(var(--electric-500)))",
        "neuro-gradient-dark":
          "linear-gradient(135deg, hsl(var(--neuro-800)), hsl(var(--electric-800)))",
        "glass-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
        "glass-gradient-dark":
          "linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.05))",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "neuro-light":
          "8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.8)",
        "neuro-dark":
          "8px 8px 16px rgba(0,0,0,0.3), -8px -8px 16px rgba(255,255,255,0.05)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        electric: "0 0 20px rgba(139, 92, 246, 0.5)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.8",
            transform: "scale(1.05)",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        shimmer: {
          "0%": {
            "background-position": "-200% 0",
          },
          "100%": {
            "background-position": "200% 0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
