import { AuthShell } from "@/components/auth-shell";
import { AuthForm } from "@/components/auth-form";

export default async function SignUp({ searchParams }: { searchParams: Promise<{ booking?: string }> }) {
  const { booking } = await searchParams;
  return <AuthShell mode="register">
    <div>
      <p className="sanctuary-eyebrow">Private patron registry</p>
      <h1>Create Your Atelier Account</h1>
      <p className="sanctuary-intro">Your space for specialist consultations, personalised treatment notes, and private sanctuary appointments.</p>
    </div>
    <AuthForm register bookingId={typeof booking === "string" ? booking : undefined}/>
  </AuthShell>;
}
