/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1A56DB",
        navy: "#0D1B3E",
        accent: "#6C63FF",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        bg: "#F9FAFB",
        ink: "#111827",
        muted: "#6B7280",
        line: "#E5E7EB",
        soft: "#F3F4F6",
        card: "#FFFFFF",
      },
      fontFamily: {
        sans: ["Inter_400Regular", "System"],
        semibold: ["Inter_600SemiBold", "System"],
        bold: ["Inter_700Bold", "System"],
      },
    },
  },
  plugins: [],
};
