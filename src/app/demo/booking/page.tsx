import Link from "next/link";
import { DemoBooking } from "@/components/demo-booking";

export default async function DemoBookingPage({ searchParams }: { searchParams: Promise<{ booking?: string }> }) {
  const { booking } = await searchParams;
  return <main className="system-page">
    <p className="eyebrow">Browser-local demo</p>
    <h1>Preview your booking</h1>
    {typeof booking === "string" ? <DemoBooking key={booking} bookingId={booking}/> : <Link href="/services">Choose a service</Link>}
  </main>;
}
