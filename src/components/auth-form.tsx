"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { api, json } from "@/lib/account-api";
import { authRequest, authenticatedAccount } from "@/lib/browser-auth";
import { getBookingDraft } from "@/mock/booking-draft";
import { toast } from "sonner";
import { ArrowUpRight, Mail, UserRound } from "lucide-react";
import { PasswordField } from "@/components/interactive";

export function AuthForm({ register, bookingId }: { register: boolean; bookingId?: string }) {
  const [google,setGoogle]=useState(false);
  useEffect(()=>{api<{google:boolean}>("/auth/providers").then((data)=>setGoogle(data.google)).catch(()=>{});},[]);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [portraitMode, setPortraitMode] = useState<"url" | "file">("url");
  const [portraitUrl, setPortraitUrl] = useState("");
  const [portraitFile, setPortraitFile] = useState<File>();
  const [objectUrl, setObjectUrl] = useState("");
  const [portraitError, setPortraitError] = useState("");
  const checks = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
  ];
  const strength = checks.filter(({ met }) => met).length;
  const bookingQuery = bookingId ? "?booking=" + encodeURIComponent(bookingId) : "";

  useEffect(() => {
    if (!portraitFile) return;
    const url = URL.createObjectURL(portraitFile);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [portraitFile]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || (register && portraitMode === "file" && portraitError)) return;
    const fields = new FormData(event.currentTarget);
    const credentials = { email: String(fields.get("email")), password };
    setError("");
    setBusy(true);
    try {
      await authRequest(register ? "/sign-up/email" : "/sign-in/email",
        register ? { ...credentials, name: String(fields.get("name")), acceptedTerms: fields.has("terms"), rememberMe: false } :
          { ...credentials, rememberMe: fields.has("remember") });
      const account = await authenticatedAccount();
      if (register) {
        try {
          const image = portraitMode === "file" && portraitFile
            ? (await api<{ image: string }>("/images/profile", { method: "POST", body: portraitFile, headers: { "Content-Type": portraitFile.type } })).image
            : /^https:\/\//i.test(portraitUrl) ? portraitUrl : "";
          if (image) await api("/users/profile", json("PATCH", { image }));
        } catch {
          toast.error("Your account was created. Add your portrait again from My Profile.");
        }
      }
      const draft = getBookingDraft(bookingId ?? null);
      const destination = account.role === "admin" ? "/admin" : draft
        ? "/services/" + encodeURIComponent(draft.service.id) + bookingQuery : "/customer";
      window.location.replace(destination);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Account request failed.");
      setBusy(false);
    }
  }

  async function continueWithGoogle() {
    if (busy) return;
    setBusy(true);
    setError("");
    const success = new URL("/sign-in" + bookingQuery, window.location.origin);
    success.searchParams.set("resume", "1");
    const failure = new URL("/sign-in" + bookingQuery, window.location.origin);
    failure.searchParams.set("error", "google");
    try {
      const result = await authRequest<{ url: string }>("/sign-in/social", {
        provider: "google", disableRedirect: true, callbackURL: success.href, errorCallbackURL: failure.href,
      });
      const destination = new URL(result.url);
      if (destination.origin !== "https://accounts.google.com") throw new Error("Google sign-in is unavailable.");
      window.location.assign(destination.href);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Google sign-in could not be started.");
      setBusy(false);
    }
  }

  const portrait = portraitMode === "file" ? (portraitFile && objectUrl) : /^https:\/\//i.test(portraitUrl) ? portraitUrl : "";
  return <>
    
    <form className="sanctuary-form" onSubmit={submit} onChange={() => setError("")}>
      {register && <label className="sanctuary-field">Patron full name
        <span className="input-icon"><UserRound size={17}/><input name="name" autoComplete="name" required minLength={2} pattern=".*\S.*" placeholder="Your full name"/></span>
      </label>}
      <label className="sanctuary-field">Patron email address
        <span className="input-icon"><Mail size={17}/><input name="email" autoComplete="email" type="email" required placeholder="Enter an email address"/></span>
      </label>
      {register && <div className="sanctuary-portrait">
        <div className="sanctuary-row"><strong>Patron portrait (optional)</strong><span className="sanctuary-portrait-tabs">
          <button type="button" aria-pressed={portraitMode === "url"} onClick={() => setPortraitMode("url")}>Image URL</button>
          <button type="button" aria-pressed={portraitMode === "file"} onClick={() => setPortraitMode("file")}>Upload preview</button>
        </span></div>
        <div className="sanctuary-portrait-preview">
          {/* eslint-disable-next-line @next/next/no-img-element -- This preview uses browser object URLs and user-entered HTTPS image URLs. */}
          {portrait ? <img key={portrait} src={portrait} referrerPolicy="no-referrer" alt="Portrait preview" onError={(event) => { event.currentTarget.hidden = true; }}/> : <UserRound size={28}/>}
          {portraitMode === "url" ? <input aria-label="Portrait image URL" type="url" pattern="https://.+" placeholder="https://…/portrait.jpg" value={portraitUrl} onChange={(event) => setPortraitUrl(event.target.value)}/> :
            <input aria-label="Portrait file" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => {
              const file = event.target.files?.[0];
              const invalid = file && (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024);
              setPortraitError(invalid ? "Choose a PNG, JPEG or WebP file up to 5 MB." : "");
              setPortraitFile(invalid ? undefined : file);
            }}/>}
        </div>
        {portraitMode === "file" && portraitError && <span role="alert">{portraitError}</span>}
        <small>Optional portrait. Uploaded images are saved when registration succeeds.</small>
      </div>}
      <div className="sanctuary-row"><label htmlFor="sanctuary-password">Private security passphrase</label>
        {register ? <span className="sanctuary-eyebrow">{password ? strength === 3 ? "Meets requirements" : "Needs attention" : "Empty"}</span> :
          <a href="#password-recovery">Forgot password?</a>}
      </div>
      <div className="sanctuary-field"><PasswordField id="sanctuary-password" minLength={register ? 8 : 1} autoComplete={register ? "new-password" : "current-password"} onChange={setPassword}
        placeholder="Enter your passphrase" pattern={register ? "(?=.*[a-z])(?=.*[A-Z]).{8,}" : undefined}/></div>
      {register ? <>
        <div className="sanctuary-rules"><strong>Passphrase requirements</strong>
          <progress value={strength} max={3} aria-label="Passphrase requirements met"/>
          <ul>{checks.map(({label, met}) => <li key={label} data-met={met}>{met ? "✓" : "○"} {label}</li>)}</ul>
        </div>
        <div className="sanctuary-notice">Patron Account Tier · Discretionary Client</div>
        <label className="sanctuary-consent"><input name="terms" type="checkbox" required/><span>I accept the <a href="#atelier-terms">atelier terms and privacy notice</a>.</span></label>
      </> : <label className="sanctuary-consent"><input name="remember" type="checkbox"/><span>Remember this device</span></label>}
      <button className="button button-dark button-full" disabled={busy}>{busy ? "Please wait…" : register ? "Create Patron Account" : "Sign In to Your Sanctuary"} <ArrowUpRight size={16}/></button>
      {error && <p className="sanctuary-notice" role="alert">{error}</p>}
    </form>
    <div className="sanctuary-partners" aria-label="Atelier partners"><span>Atelier partners</span><div>{google ? <button type="button" className="button button-outline" disabled={busy} onClick={continueWithGoogle}>Continue with Google</button> : <button type="button" disabled>Google unavailable</button>}<button type="button" disabled>Apple unavailable</button></div></div>
    <p className="sanctuary-switch">{register ? "Already hold an atelier profile?" : "New to our sanctuary?"}{" "}
      <Link href={(register ? "/sign-in" : "/sign-up") + bookingQuery}>{register ? "Sign In to Your Sanctuary" : "Create an Atelier Account"}</Link>
    </p>
    {register ? <section className="sanctuary-recovery" id="atelier-terms" aria-label="Atelier terms and privacy notice"><strong>Atelier terms and privacy notice</strong>
      <p>Account details are used to manage your SalonBook bookings. Local booking previews stay in your browser.</p>
    </section> : <section className="sanctuary-recovery" id="password-recovery" aria-label="Password recovery">
      Password recovery is currently unavailable. Contact the concierge for account assistance.
    </section>}
  </>;
}
