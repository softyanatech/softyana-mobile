export const Colors = {
  primary: "#1A56DB",
  primaryLight: "#EBF1FD",
  navy: "#0D1B3E",
  accent: "#6C63FF",
  accentLight: "#EFEFFD",
  success: "#10B981",
  successLight: "#D1FAE5",
  warning: "#F59E0B",
  warningLight: "#FEF3C7",
  danger: "#EF4444",
  dangerLight: "#FEE2E2",
  bg: "#F9FAFB",
  ink: "#111827",
  inkLight: "#374151",
  muted: "#6B7280",
  line: "#E5E7EB",
  soft: "#F3F4F6",
  card: "#FFFFFF",
  white: "#FFFFFF",
  overlay: "rgba(0,0,0,0.5)",
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const FontSize = {
  xs: 11,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 28,
  "4xl": 32,
} as const;

export const Shadow = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: "#1A56DB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const StatusColors: Record<string, { bg: string; text: string }> = {
  Planning: { bg: "#EBF1FD", text: "#1A56DB" },
  "In Progress": { bg: "#FEF3C7", text: "#D97706" },
  Testing: { bg: "#EFEFFD", text: "#6C63FF" },
  Live: { bg: "#D1FAE5", text: "#059669" },
  Paid: { bg: "#D1FAE5", text: "#059669" },
  Pending: { bg: "#FEF3C7", text: "#D97706" },
  EMI: { bg: "#EFEFFD", text: "#6C63FF" },
  Overdue: { bg: "#FEE2E2", text: "#DC2626" },
  Open: { bg: "#FEF3C7", text: "#D97706" },
  Resolved: { bg: "#D1FAE5", text: "#059669" },
  Completed: { bg: "#D1FAE5", text: "#059669" },
  Low: { bg: "#D1FAE5", text: "#059669" },
  Medium: { bg: "#FEF3C7", text: "#D97706" },
  High: { bg: "#FEE2E2", text: "#DC2626" },
};
