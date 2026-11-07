const DATE = { day: "2-digit", month: "short", year: "numeric" };

export const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-GB", DATE);
};

export const formatDateTime = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${d.toLocaleDateString("en-GB", DATE)}, ${time}`;
};

export const initials = (name = "") =>
  String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("") || "?";

// "PLANT1" -> "Plant 1"
export const plantLabel = (code = "") =>
  String(code).replace(/^PLANT(\d+)$/i, "Plant $1");

// Reads the payload of a JWT (display only — the server is what enforces access).
export const readToken = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
};

// Plants the app supports (used for filter chips). Add "PLANT4" here if a plant is ever added.
export const PLANTS = ["PLANT1", "PLANT2", "PLANT3"];
