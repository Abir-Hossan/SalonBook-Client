"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { dateLabel, money } from "@/lib/utils";
import { isBookableDate, localDateKey } from "@/lib/booking-dates";
import { finishBookingDraft, getBookingDraft } from "@/mock/booking-draft";
import { currentCustomer } from "@/mock/data";
import { addPreviewAppointment } from "@/mock/storage";

export function DemoBooking({ bookingId }: { bookingId: string }) {
  const [draft, setDraft] = useState<ReturnType<typeof getBookingDraft> | undefined>(undefined);
  useEffect(() => { setDraft(getBookingDraft(bookingId)); }, [bookingId]);
  const [complete, setComplete] = useState(false);
  if (draft === undefined) return <p role="status">Loading browser preview…</p>;
  if (!draft) return <div className="form-stack">
    <p role="status">This booking preview is unavailable or has expired.</p>
    <Link className="button button-outline" href="/services">Return to services</Link>
  </div>;

  const servicePath = "/services/" + encodeURIComponent(draft.service.id);
  function submit() {
    if (!draft || !isBookableDate(draft.date)) {
      toast.error("That date has passed. Return to the service to pick another.");
      return;
    }
    try {
      addPreviewAppointment({
        id: `PREVIEW-${draft.id}`,
        serviceId: draft.service.id,
        serviceName: draft.service.serviceName,
        serviceImage: draft.service.image,
        servicePrice: draft.service.price,
        customerName: currentCustomer.name,
        customerEmail: currentCustomer.email,
        appointmentDate: draft.date,
        timeSlot: draft.time,
        createdAt: localDateKey(),
        status: "pending",
        paymentStatus: "unpaid",
      });
      finishBookingDraft();
      setComplete(true);
    } catch {
      toast.error("This browser could not save the preview appointment.");
    }
  }

  return <div className="form-stack">
    <p><strong>{draft.service.serviceName}</strong><br/>{dateLabel(draft.date)} · {draft.time} · {money(draft.service.price)}</p>
    <p className="form-disclaimer">Optional demo. This saves a sample appointment in this browser only. Account services are separate.</p>
    {complete ? <>
      <p role="status">Preview appointment added as Pending.</p>
      <Link className="button button-dark button-full" href="/demo/customer/appointments">View demo appointments <ArrowUpRight size={15}/></Link>
    </> : <button className="button button-dark button-full" type="button" onClick={submit}>Submit preview appointment <ArrowUpRight size={15}/></button>}
    <Link className="text-link" href={complete ? servicePath : `${servicePath}?booking=${encodeURIComponent(bookingId)}`}>
      {complete ? "Return to service" : "Return to service and edit selection"}
    </Link>
  </div>;
}
