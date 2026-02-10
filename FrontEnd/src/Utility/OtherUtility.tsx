const arrayToCSV = (value: any): string => {
  if (!value) return "-";

  // If already an array
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "-";
  }

  // If backend sends JSON string
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) && parsed.length > 0
        ? parsed.join(", ")
        : "-";
    } catch {
      // normal string fallback
      return value.trim() ? value : "-";
    }
  }

  return "-";
};

export { arrayToCSV };
