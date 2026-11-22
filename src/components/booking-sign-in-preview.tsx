"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { dateLabel, money } from "@/lib/utils";
import { getBookingDraft } from "@/mock/booking-draft";

export function BookingSignInPreview({ bookingId, signedIn }: { bookingId: string; signedIn?: boolean }) {
  const [draft, setDraft] = useState<ReturnType<typeof getBookingDraft> | undefined>(undefined);
  useEffect(() => { setDraft(getBookingDraft(bookingId)); }, [bookingId]);
  if (draft === undefined) return <p role="status">Loading your selection…</p>;
  if (!draft) return <div className="sanctuary-notice">
    <p>This booking selection has expired.</p>
    <Link href="/services">Return to services</Link>
  </div>;
  const service = "/services/" + encodeURIComponent(draft.service.id);
  const query = "?booking=" + encodeURIComponent(bookingId);
  return <section className="sanctuary-notice" aria-label="Pending booking">
    <strong>Pending booking · {draft.service.serviceName}</strong>
    <p>{dateLabel(draft.date)} · {draft.time} · {money(draft.service.price)}</p>
    <p>{signedIn ? "You are signed in. Return to the service to submit your request." : "Sign in to continue with this selection."}</p>
    <div className="sanctuary-row">
      <Link href={service + query}>{signedIn ? "Continue booking" : "Edit booking selection"}</Link>

    </div>
  </section>;
}
