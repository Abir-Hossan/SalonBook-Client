"use client";
import { useEffect, useState } from "react";
import { api, type ApiAppointment } from "@/lib/account-api";

export function PaymentStatus({ appointment }: { appointment: string }) {
  const [message,setMessage]=useState("Checking payment status…");
  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let attempts = 0;
    async function check(){
      try {
        const row = await api<ApiAppointment>("/appointments/" + appointment,{ signal: controller.signal });
        if (controller.signal.aborted) return;
        if (row.paymentStatus === "paid") { setMessage("Payment confirmed."); return; }
        setMessage("Payment confirmation is pending. Check My Appointments for the latest status.");
        if (++attempts < 10) timer = setTimeout(check, 2500);
      } catch {
        if (!controller.signal.aborted) setMessage("Payment status is unavailable. Check My Appointments.");
      }
    }
    void check();
    return () => { controller.abort(); clearTimeout(timer); };
  }, [appointment]);
  return <p role="status">{message}</p>;
}
