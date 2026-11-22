import { redirect } from "next/navigation";
import { currentAccount } from "@/lib/server-account";
import { AuthShell } from "@/components/auth-shell";
import { AuthForm } from "@/components/auth-form";
import { BookingSignInPreview } from "@/components/booking-sign-in-preview";

export default async function SignIn({ searchParams }: { searchParams: Promise<{ booking?: string; resume?: string; error?: string }> }) {
  const { booking, resume, error } = await searchParams;
  const bookingId = typeof booking === "string" ? booking : undefined;
  const account = resume === "1" || bookingId ? await currentAccount() : null;
  if (resume === "1" && account?.role === "admin") redirect("/admin");
  if (resume === "1" && account?.role === "customer" && !bookingId) redirect("/customer");
  return <AuthShell mode="login">
    <div>
      <p className="sanctuary-eyebrow">Patron authentication</p>
      <h1>Sign In to SalonBook</h1>
      <p className="sanctuary-intro">Access your appointments, saved artisans, and bespoke itineraries when account services are available.</p>
    </div>
    {(error || (resume === "1" && !account)) && <p className="sanctuary-notice" role="alert">Google sign-in could not be completed. Try again or sign in with your account password.</p>}
    {bookingId && <BookingSignInPreview bookingId={bookingId} signedIn={account?.role === "customer"}/>}
    {account?.role !== "customer" || !bookingId ? <AuthForm register={false} bookingId={bookingId}/> : null}
  </AuthShell>;
}
