export type Role = "customer" | "admin";
export type AppointmentStatus = "pending" | "confirmed" | "cancelled";
export type PaymentStatus = "unpaid" | "paid";
export type ServiceStatus = "active" | "inactive";
export interface Service {
  id: string; serviceName: string; category: string; description: string;
  price: number; duration: number; image: string; status: ServiceStatus; featured?: boolean;
}
export interface Appointment {
  id: string; serviceId: string; customerName: string; customerEmail: string;
  serviceName: string; serviceImage: string; appointmentDate: string; timeSlot: string;
  servicePrice: number; status: AppointmentStatus; paymentStatus: PaymentStatus;
  createdAt: string; message?: string;
}
export interface Customer {
  id: string; name: string; email: string; image: string; joined: string;
  appointments: number; status: "active" | "blocked";
}
export interface Transaction {
  id: string; customerName: string; serviceName: string; appointmentDate: string;
  amount: number; currency: string; status: "paid" | "pending" | "failed";
  method: string; createdAt: string;
}
