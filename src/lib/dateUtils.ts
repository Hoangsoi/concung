/**
 * Utility functions to format date and time in Vietnam Timezone (Asia/Ho_Chi_Minh - UTC+7)
 */

export function formatVNDateTime(dateInput?: string | Date | null): string {
  if (!dateInput) return "—";
  try {
    let d: Date;
    if (dateInput instanceof Date) {
      d = dateInput;
    } else {
      let str = String(dateInput).trim();
      // Normalize postgres timestamp string if missing timezone specifier
      if (!str.endsWith("Z") && !str.includes("+") && !str.includes("Z")) {
        str = str.replace(" ", "T") + "Z";
      }
      d = new Date(str);
    }

    if (isNaN(d.getTime())) return "—";

    const formatter = new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(d);
    const getPart = (type: string) => parts.find((p) => p.type === type)?.value || "";

    const day = getPart("day");
    const month = getPart("month");
    const year = getPart("year");
    const hour = getPart("hour");
    const minute = getPart("minute");
    const second = getPart("second");

    return `${hour}:${minute}:${second} ${day}/${month}/${year}`;
  } catch {
    return "—";
  }
}

export function formatVNDate(dateInput?: string | Date | null): string {
  if (!dateInput) return "—";
  try {
    let d: Date;
    if (dateInput instanceof Date) {
      d = dateInput;
    } else {
      let str = String(dateInput).trim();
      if (!str.endsWith("Z") && !str.includes("+") && !str.includes("Z")) {
        str = str.replace(" ", "T") + "Z";
      }
      d = new Date(str);
    }

    if (isNaN(d.getTime())) return "—";

    const formatter = new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const parts = formatter.formatToParts(d);
    const getPart = (type: string) => parts.find((p) => p.type === type)?.value || "";

    const day = getPart("day");
    const month = getPart("month");
    const year = getPart("year");

    return `${day}/${month}/${year}`;
  } catch {
    return "—";
  }
}
