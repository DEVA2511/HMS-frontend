const formatDate = (value: any): string => {
  if (!value) return "-";

  const date = new Date(value);

  if (isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatDateTime = (value: any): string => {
  if (!value) return "-";

  const date = new Date(value);
  if (isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-IN", {
    weekday: "short", // Thu
    day: "2-digit",
    month: "short", // Jan
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export { formatDate, formatDateTime };
