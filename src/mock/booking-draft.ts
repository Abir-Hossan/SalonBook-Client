import type { Service } from "@/types";
import { bookingTimes, isBookableDate } from "@/lib/booking-dates";

type BookingDraft = {
  id: string;
  service: Pick<Service, "id" | "serviceName" | "image" | "price">;
  date: string;
  time: string;
};

const key = "salonbook.preview.booking-draft";

export function saveBookingDraft(draft: BookingDraft) {
  window.sessionStorage.setItem(key, JSON.stringify(draft));
}

export function getBookingDraft(id: string | null): BookingDraft | null {
  if (!id) return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return null;
    const draft = JSON.parse(raw) as BookingDraft;
    return draft.id === id && draft.service?.id && isBookableDate(draft.date) &&
      bookingTimes.includes(draft.time) ? draft : null;
  } catch {
    return null;
  }
}

export function finishBookingDraft() {
  window.sessionStorage.removeItem(key);
}
