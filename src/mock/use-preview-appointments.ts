"use client";

import { useEffect, useState } from "react";
import type { Appointment } from "@/types";
import { getPreviewAppointments, previewAppointmentsChanged } from "@/mock/storage";

export function usePreviewAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  useEffect(() => {
    const refresh = () => setAppointments(getPreviewAppointments());
    refresh();
    window.addEventListener(previewAppointmentsChanged, refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("pageshow", refresh);
    return () => {
      window.removeEventListener(previewAppointmentsChanged, refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("pageshow", refresh);
    };
  }, []);
  return appointments;
}
