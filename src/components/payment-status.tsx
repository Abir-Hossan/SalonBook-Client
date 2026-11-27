"use client";
import { useEffect, useState } from "react";
import { api, type ApiAppointment } from "@/lib/account-api";
import { dateLabel, money } from "@/lib/utils";

export function PaymentStatus({ appointment }: { appointment: string }) {
  const [message, setMessage] = useState("Checking payment status.");
  const [canRetry, setCanRetry] = useState(false);
  const [retry, setRetry] = useState(0);
  const [details, setDetails] = useState<ApiAppointment>();

  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let attempts = 0;
    setMessage("Checking payment status.");
    setCanRetry(false);
    setDetails(undefined);

    async function check() {
      try {
        const row = await api<ApiAppointment>("/appointments/" + appointment, { signal: controller.signal });
        if (controller.signal.aborted) return;
        setDetails(row);
        if (row.paymentStatus === "paid") {
          setMessage("Payment confirmed.");
          return;
        }
        if (row.status === "cancelled") {
          setMessage("This appointment was cancelled.");
          return;
        }
        setMessage("Payment confirmation is pending. Check My Appointments for the latest status.");
        if (++attempts < 10) timer = setTimeout(check, 2500);
        else setCanRetry(true);
      } catch {
        if (controller.signal.aborted) return;
        setMessage("Payment status is unavailable. Check My Appointments.");
        setCanRetry(true);
      }
    }

    void check();
    return () => { controller.abort(); clearTimeout(timer); };
  }, [appointment, retry]);

  return <>
    <p role="status">{message}</p>
    {details && <p>{details.serviceName ?? "Appointment"} · {dateLabel(details.appointmentDate)} · {details.timeSlot} · {money(details.servicePrice)}</p>}
    {canRetry && <button className="button button-outline" type="button" onClick={() => setRetry((value) => value + 1)}>Check payment status again</button>}
  </>;
}
