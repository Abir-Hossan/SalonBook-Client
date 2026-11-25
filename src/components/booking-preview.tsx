"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api, ApiError, json } from "@/lib/account-api";
import { finishBookingDraft, getBookingDraft, saveBookingDraft } from "@/mock/booking-draft";
import type { Service } from "@/types";

type Availability = { date: string; earliestDate: string; timeZone: string; times: string[] };

export function BookingPreview({ service, accountRole }: { service: Pick<Service, "id" | "serviceName" | "image" | "price">; accountRole?: "customer" | "admin" }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [availability, setAvailability] = useState<Availability>();
  const [availabilityError, setAvailabilityError] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const draft = getBookingDraft(new URLSearchParams(window.location.search).get("booking"));
    if (draft?.service.id === service.id) {
      setDate(draft.date);
      setTime(draft.time);
    }
  }, [service.id]);

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ serviceId: service.id });
    if (date) query.set("date", date);
    api<Availability>("/appointments/availability?" + query, { signal: controller.signal }).then((next) => {
      if (controller.signal.aborted) return;
      setAvailability(next);
      setAvailabilityError("");
      setTime((selected) => next.times.includes(selected) ? selected : "");
    }).catch((error: unknown) => {
      if (controller.signal.aborted) return;
      if (date && error instanceof ApiError && error.status === 422) {
        setAvailability(undefined);
        setDate("");
        return;
      }
      setAvailability(undefined);
      setAvailabilityError(error instanceof Error ? error.message : "Could not load available times.");
    });
    return () => controller.abort();
  }, [date, refresh, service.id]);

  const selectedDate = date || availability?.date || "";
  const times = availability?.date === selectedDate ? availability.times : [];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || accountRole === "admin" || !times.includes(time)) return;
    const goToSignIn = () => {
      try {
        const id = crypto.randomUUID();
        saveBookingDraft({ id, service, date: selectedDate, time });
        window.location.assign("/sign-in?booking=" + id);
      } catch {
        toast.error("This browser could not save the booking selection.");
      }
    };
    if (accountRole !== "customer") {
      goToSignIn();
      return;
    }
    setBusy(true);
    try {
      await api("/appointments", json("POST", { serviceId: service.id, appointmentDate: selectedDate, timeSlot: time }));
      finishBookingDraft();
      toast.success("Appointment requested.");
      router.push("/customer/appointments");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) goToSignIn();
      else {
        if (error instanceof ApiError && error.status === 409) {
          setAvailability(undefined);
          setRefresh((value) => value + 1);
        }
        toast.error(error instanceof Error ? error.message : "The appointment could not be saved.");
      }
      setBusy(false);
    }
  }

  return <form className="booking-panel" onSubmit={submit}>
    <div className="booking-panel-head">
      <div><p className="eyebrow">MAKE IT YOURS</p><h3>Request an appointment</h3></div>
      <span className="booking-step">01 / 01</span>
    </div>
    <label className="field">
      <span>Preferred date</span>
      <span className="input-icon"><CalendarDays size={15}/><input type="date" min={availability?.earliestDate} value={selectedDate} onChange={(event) => { setDate(event.target.value); setTime(""); }} required/></span>
    </label>
    <label className="field">
      <span>Preferred time</span>
      <span className="input-icon"><Clock3 size={15}/><select required disabled={!times.length} value={times.includes(time) ? time : ""} onChange={(event) => setTime(event.target.value)}><option value="">{times.length ? "Choose a time" : "No times available"}</option>{times.map((slot) => <option key={slot}>{slot}</option>)}</select></span>
    </label>
    {availabilityError && <p role="alert">{availabilityError} <button type="button" onClick={() => setRefresh((value) => value + 1)}>Retry</button></p>}
    {!availabilityError && availability?.date !== selectedDate && <p role="status">Checking available times.</p>}
    <button className="button button-dark button-full" disabled={!times.includes(time) || busy || accountRole === "admin"}>{busy ? "Saving…" : accountRole === "customer" ? "Request appointment" : "Continue to sign in"} <ArrowUpRight size={15}/></button>
    <small>{accountRole === "admin" ? "Use a customer account to book." : availability ? `Times are in ${availability.timeZone}. Requests are reviewed before confirmation.` : "Requests are reviewed before confirmation."}</small>
  </form>;
}
