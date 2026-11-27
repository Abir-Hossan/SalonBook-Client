import { ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { AuthForm } from "@/components/auth-form";

export default async function SignUp({ searchParams }: { searchParams: Promise<{ booking?: string }> }) {
  const { booking } = await searchParams;
  return <AuthShell mode="register">
    <div>
      <p className="sanctuary-eyebrow">Better Auth client enrollment</p>
      <h1>Create Your Atelier Account</h1>
      <p className="sanctuary-intro">Register to consult with specialist stylists and reserve private salon appointments.</p>
    </div>
    <div className="sanctuary-security sanctuary-mandate">
      <span className="sanctuary-mandate-icon"><ShieldCheck size={18} aria-hidden="true"/></span>
      <div><div className="sanctuary-mandate-title"><strong>Strict security mandate</strong><span>Sanctuary patron tier only</span></div><p>Public registration is restricted to customer accounts. Administrator access is managed separately.</p></div>
    </div>
    <AuthForm register bookingId={typeof booking === "string" ? booking : undefined}/>
  </AuthShell>;
}
