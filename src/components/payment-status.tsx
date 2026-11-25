"use client";
import { useEffect, useState } from "react";
import { api, type ApiAppointment } from "@/lib/account-api";

export function PaymentStatus({ appointment }: { appointment: string }) {
  const [message, setMessage] = useState("Checking payment status.");
  const [canRetry, setCanRetry] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let attempts = 0;
    setMessage("Checking payment status.");
    setCanRetry(false);

    async function check() {
      try {
        const row = await api<ApiAppointment>("/appointments/" + appointment, { signal: controller.signal });
        if (controller.signal.aborted) return;
        if (row.paymentStatus === "paid") {
          setMessage("Payment confirmed.");
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
    {canRetry && <button className="button button-outline" type="button" onClick={() => setRetry((value) => value + 1)}>Check payment status again</button>}
  </>;
}
