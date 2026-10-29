// Shared formatting utilities for ARK Connect

/**
 * Formats a currency value with Indian digit grouping: "Rs 13,500"
 */
export function formatCurrency(amount: number): string {
  const rounded = Math.round(amount);
  return `Rs ${rounded.toLocaleString("en-IN")}`;
}

/**
 * Formats counts with proper pluralization:
 * formatPlural(1, "item", "items") -> "1 item"
 * formatPlural(2, "item", "items") -> "2 items"
 */
export function formatPlural(count: number, singular: string, plural: string): string {
  return `${count.toLocaleString("en-IN")} ${count === 1 ? singular : plural}`;
}

export function formatPieces(count: number): string {
  return formatPlural(count, "pc", "pcs");
}

export function formatItems(count: number): string {
  return formatPlural(count, "item", "items");
}

/**
 * Calculates current week Monday to Sunday range string based on a given or today's date.
 * E.g., for 29 Oct 2026 -> "Mon 26 Oct – Sun 01 Nov 2026"
 */
export function getCurrentWeekRange(referenceDate: Date = new Date("2026-10-29T12:00:00+05:30")): {
  startDate: Date;
  endDate: Date;
  label: string;
} {
  const d = new Date(referenceDate);
  // Get day of week (0 is Sunday, 1 is Monday... 6 is Saturday)
  const day = d.getDay();
  // Monday is 1; if Sunday (0), distance to previous Monday is 6
  const diffToMonday = day === 0 ? -6 : 1 - day;
  
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const startDay = monday.getDate().toString().padStart(2, "0");
  const startMonth = monday.toLocaleString("en-IN", { month: "short" });
  const endDay = sunday.getDate().toString().padStart(2, "0");
  const endMonth = sunday.toLocaleString("en-IN", { month: "short" });
  const year = sunday.getFullYear();

  return {
    startDate: monday,
    endDate: sunday,
    label: `Mon ${startDay} ${startMonth} – Sun ${endDay} ${endMonth} ${year}`,
  };
}

/**
 * Calculates the previous completed Monday 00:00 to Sunday 23:59:59.999 window.
 * For 29 Oct 2026, this is: Mon 19 Oct to Sun 25 Oct 2026.
 */
export function getPreviousCompletedWeekRange(referenceDate: Date = new Date("2026-10-29T12:00:00+05:30")): {
  startDate: Date;
  endDate: Date;
  label: string;
  formattedRange: string;
} {
  const currentWeek = getCurrentWeekRange(referenceDate);
  const prevMonday = new Date(currentWeek.startDate);
  prevMonday.setDate(prevMonday.getDate() - 7);

  const prevSunday = new Date(prevMonday);
  prevSunday.setDate(prevMonday.getDate() + 6);
  prevSunday.setHours(23, 59, 59, 999);

  const startDay = prevMonday.getDate().toString().padStart(2, "0");
  const startMonth = prevMonday.toLocaleString("en-IN", { month: "short" });
  const endDay = prevSunday.getDate().toString().padStart(2, "0");
  const endMonth = prevSunday.toLocaleString("en-IN", { month: "short" });
  const year = prevSunday.getFullYear();

  return {
    startDate: prevMonday,
    endDate: prevSunday,
    label: `Mon ${startDay} ${startMonth} to Sun ${endDay} ${endMonth} ${year}`,
    formattedRange: `${startDay} ${startMonth} – ${endDay} ${endMonth} ${year}`,
  };
}

