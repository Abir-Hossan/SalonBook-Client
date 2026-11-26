import { ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { AuthForm } from "@/components/auth-form";

export default async function SignUp({ searchParams }: { searchParams: Promise<{ booking?: string }> }) {
  const { booking } = await searchParams;
  return <AuthShell mode="register">
    <div>
      <p className="sanctuary-eyebrow">Better Auth client enrollment</p>
      <h1>Create Your Atelier Account</h1>
      <p className="sanctuary-intro">Your space for specialist consultations, personalised treatment notes, and private sanctuary appointments.</p>
    </div>
    <div className="sanctuary-security">
      <ShieldCheck size={22} aria-hidden="true"/>
      <div><strong>Patron account registration</strong><p>Public registration creates a customer account for booking and managing appointments. Administrator access is managed separately.</p></div>
    </div>
    <AuthForm register bookingId={typeof booking === "string" ? booking : undefined}/>
  </AuthShell>;
}
