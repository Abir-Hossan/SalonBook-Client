"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { bookingTimes, isBookableDate } from "@/lib/booking-dates";
import { api, ApiError, json } from "@/lib/account-api";
import { finishBookingDraft, getBookingDraft, saveBookingDraft } from "@/mock/booking-draft";
import type { Service } from "@/types";

function earliestDate() {
  const today = new Date();
  today.setUTCDate(today.getUTCDate() + 1);
  return today.toISOString().slice(0, 10);
}

export function BookingPreview({ service, accountRole }: { service: Pick<Service, "id" | "serviceName" | "image" | "price">; accountRole?: "customer" | "admin" }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [today, setToday] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState(bookingTimes[1]);

  useEffect(() => {
    const draft = getBookingDraft(new URLSearchParams(window.location.search).get("booking"));
    const current = earliestDate();
    setToday(current);
    if (draft && draft.service.id === service.id) {
      setDate(draft.date < current ? current : draft.date);
      setTime(draft.time);
    } else {
      setDate(current);
    }
    const refresh = () => {
      const now = earliestDate();
      setToday(now);
      setDate((selected) => selected && selected < now ? now : selected);
    };
    window.addEventListener("focus", refresh);
    const timer = window.setInterval(refresh, 30_000);
    return () => {
      window.removeEventListener("focus", refresh);
      window.clearInterval(timer);
    };
  }, [service.id]);

  async function continueToSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || accountRole === "admin") return;
    if (!isBookableDate(date, earliestDate())) {
      toast.error("Choose an available future date.");
      return;
    }
    if (!bookingTimes.includes(time)) {
      toast.error("Choose an available preview time.");
      return;
    }
    const goToSignIn = () => {
      try {
        const id = crypto.randomUUID();
        saveBookingDraft({ id, service, date, time });
        window.location.assign("/sign-in?booking=" + id);
      } catch {
        toast.error("This browser could not save the booking selection.");
      }
    };
    if (accountRole === "customer") {
      setBusy(true);
      try {
        await api("/appointments", json("POST", { serviceId: service.id, appointmentDate: date, timeSlot: time }));
        finishBookingDraft();
        toast.success("Appointment requested.");
        router.push("/customer/appointments");
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          goToSignIn();
        } else toast.error(error instanceof Error ? error.message : "The appointment could not be saved.");
        setBusy(false);
      }
      return;
    }
    goToSignIn();
  }

  return <form className="booking-panel" onSubmit={continueToSignIn}>
    <div className="booking-panel-head">
      <div><p className="eyebrow">MAKE IT YOURS</p><h3>Request an appointment</h3></div>
      <span className="booking-step">01 / 01</span>
    </div>
    <label className="field">
      <span>Preferred date</span>
      <span className="input-icon"><CalendarDays size={15}/><input type="date" min={today || undefined} value={date} onChange={(event) => setDate(event.target.value)} disabled={!today} required/></span>
    </label>
    <label className="field">
      <span>Preferred time</span>
      <span className="input-icon"><Clock3 size={15}/><select value={time} onChange={(event) => setTime(event.target.value)}>{bookingTimes.map((slot) => <option key={slot}>{slot}</option>)}</select></span>
    </label>
    <button className="button button-dark button-full" disabled={!today || busy || accountRole === "admin"}>{busy ? "Saving…" : accountRole === "customer" ? "Request appointment" : "Continue to sign in"} <ArrowUpRight size={15}/></button>
    <small>{accountRole === "admin" ? "Use a customer account to book." : "Requests are reviewed before confirmation."}</small>
  </form>;
}
