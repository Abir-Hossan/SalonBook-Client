import Link from "next/link";
import { requireAccount } from "@/lib/server-account";
import { PaymentStatus } from "@/components/payment-status";
export default async function PaymentSuccess({ searchParams }: { searchParams: Promise<{ appointment?: string }> }) {
  await requireAccount("customer");
  const { appointment } = await searchParams;
  return <main className="system-page payment-result"><p className="eyebrow">SalonBook checkout</p>
    <h1>Payment confirmation</h1>
    {typeof appointment === "string" && /^[a-f0-9]{24}$/i.test(appointment) ? <PaymentStatus appointment={appointment}/> : <p>No appointment was selected.</p>}
    <div className="button-row">
      <Link className="button button-dark" href="/customer/appointments">View appointments</Link>
      <Link className="button button-outline" href="/customer/transactions">View payment history</Link>
    </div>
  </main>;
}
