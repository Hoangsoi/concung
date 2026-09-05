/**
 * Utility functions to format date and time in Vietnam Timezone (Asia/Ho_Chi_Minh - UTC+7)
 */

export function formatVNDateTime(dateInput?: string | Date | null): string {
  if (!dateInput) return "—";
  try {
    let str = typeof dateInput === "string" ? dateInput : dateInput.toISOString();
    // Normalize postgres timestamp string if missing timezone specifier
    if (typeof dateInput === "string" && !dateInput.endsWith("Z") && !dateInput.includes("+")) {
      str = dateInput.replace(" ", "T") + "Z";
    }
    const d = new Date(str);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return "—";
  }
}

export function formatVNDate(dateInput?: string | Date | null): string {
  if (!dateInput) return "—";
  try {
    let str = typeof dateInput === "string" ? dateInput : dateInput.toISOString();
    if (typeof dateInput === "string" && !dateInput.endsWith("Z") && !dateInput.includes("+")) {
      str = dateInput.replace(" ", "T") + "Z";
    }
    const d = new Date(str);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return "—";
  }
}
