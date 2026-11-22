import type { Customer, Service, Appointment } from "@/types";
import { appointments, customers, services } from "@/mock/data";

const KEYS = {
  services: "salonbook.preview.services.v2",
  appointments: "salonbook.preview.appointments.v2",
  customers: "salonbook.preview.customers.v2",
} as const;

function read<T>(key:string,fallback:T):T {
  if(typeof window==="undefined") return fallback;
  try { const raw=window.localStorage.getItem(key); return raw?JSON.parse(raw) as T:fallback; }
  catch { return fallback; }
}
function write<T>(key:string,value:T){if(typeof window!=="undefined")window.localStorage.setItem(key,JSON.stringify(value));}
export const getPreviewServices=()=>read<Service[]>(KEYS.services,services);
export const savePreviewService=(item:Service)=>{
 const current=getPreviewServices(); write(KEYS.services,[item,...current.filter(s=>s.id!==item.id)]);
};
export const getPreviewAppointments=()=>read<Appointment[]>(KEYS.appointments,appointments);
export const previewAppointmentsChanged = "salonbook:preview-appointments";
export function savePreviewAppointments(items: Appointment[]) {
  write(KEYS.appointments, items);
  window.dispatchEvent(new Event(previewAppointmentsChanged));
}

export function addPreviewAppointment(appointment: Appointment) {
  const current = getPreviewAppointments();
  if (!current.some((item) => item.id === appointment.id)) {
    savePreviewAppointments([appointment, ...current]);
  }
}

export function updatePreviewAppointmentStatus(
  id: string,
  status: Appointment["status"],
  allowed: Appointment["status"][],
) {
  const current = getPreviewAppointments();
  if (!current.some((item) => item.id === id && allowed.includes(item.status))) return false;
  savePreviewAppointments(current.map((item) => item.id === id ? { ...item, status } : item));
  return true;
}
export const getPreviewCustomers=()=>read<Customer[]>(KEYS.customers,customers);
export const savePreviewCustomers=(items:Customer[])=>write(KEYS.customers,items);

export const deletePreviewService=(id:string)=>write(KEYS.services,getPreviewServices().filter(s=>s.id!==id));
