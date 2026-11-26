"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { api, json } from "@/lib/account-api";
import { authRequest, authenticatedAccount } from "@/lib/browser-auth";
import { getBookingDraft } from "@/mock/booking-draft";
import { toast } from "sonner";
import { Apple, ArrowRight, Check, CircleCheck, Link2, LockKeyhole, Mail, UserRound } from "lucide-react";
import { PasswordField } from "@/components/interactive";
import { useAuthShowcase } from "./auth-showcase";

export function AuthForm({ register, bookingId }: { register: boolean; bookingId?: string }) {
  const demo = useAuthShowcase()?.state ?? "normal";
  const isPreview = demo !== "normal";
  const [google, setGoogle] = useState<boolean>();
  const [portraitUpload, setPortraitUpload] = useState<boolean>();
  useEffect(() => {
    const controller = new AbortController();
    api<{google: boolean; portraitUpload?: boolean}>("/auth/providers", { signal: controller.signal }).then((data) => {
      if (controller.signal.aborted) return;
      setGoogle(data.google);
      setPortraitUpload(data.portraitUpload === true);
    }).catch(() => {
      if (controller.signal.aborted) return;
      setGoogle(false);
      setPortraitUpload(false);
    });
    return () => controller.abort();
  }, []);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [portraitMode, setPortraitMode] = useState<"url" | "file">("url");
  const [portraitUrl, setPortraitUrl] = useState("");
  const [portraitFile, setPortraitFile] = useState<File>();
  const [objectUrl, setObjectUrl] = useState("");
  const [previewLoaded, setPreviewLoaded] = useState("");
  const [previewFailed, setPreviewFailed] = useState("");
  const [portraitError, setPortraitError] = useState("");
  const checks = [
    { label: "Min 8 characters", met: password.length >= 8 },
    { label: "Uppercase and lowercase letters", met: /[A-Z]/.test(password) && /[a-z]/.test(password) },
    { label: "At least 1 special symbol", met: /[\p{P}\p{S}]/u.test(password) },
    { label: "At least 1 numeric digit", met: /[0-9]/.test(password) },
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
    if (isPreview || busy || (register && portraitMode === "file" && portraitError)) return;
    const fields = new FormData(event.currentTarget);
    const credentials = { email: String(fields.get("email")), password };
    setError("");
    setBusy(true);
    try {
      await authRequest(register ? "/sign-up/email" : "/sign-in/email",
        register ? { ...credentials, name: String(fields.get("name")).trim(), acceptedTerms: fields.has("terms"), rememberMe: false } :
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
    if (isPreview || busy || google !== true) return;
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
  const submitting = busy || demo === "loading";
  const previewError = demo === "invalid" ? "Preview: check the highlighted fields." : demo === "failure" ? (register ? "Preview: this email address is already registered." : "Preview: the email address or passphrase is incorrect.") : "";
  return <>
    <form className="sanctuary-form" aria-busy={submitting} onSubmit={submit} onChange={() => setError("")} data-preview-invalid={demo === "invalid" || undefined}>
      {register && <label className="sanctuary-field">
        <span className="sanctuary-row"><span>Full name</span><small>Legal or preferred identity</small></span>
        <span className="input-icon"><UserRound size={17} aria-hidden="true"/><input aria-label="Full name" aria-invalid={demo === "invalid" || undefined} name="name" autoComplete="name" required minLength={2} maxLength={120} pattern=".*\S.*" placeholder="Your full name"/></span>
      </label>}
      <label className="sanctuary-field">
        <span className="sanctuary-row"><span>{register ? "Confidential email address" : "Patron email address"}</span>{register && <small>Primary authentication identity</small>}</span>
        <span className="input-icon"><Mail size={17} aria-hidden="true"/><input aria-label={register ? "Confidential email address" : "Patron email address"} aria-invalid={demo === "invalid" || undefined} name="email" autoComplete="email" type="email" required maxLength={254} placeholder="you@example.com"/></span>
      </label>
      {register && <div className="sanctuary-portrait">
        <div className="sanctuary-row sanctuary-portrait-header"><div><strong>Patron portrait (optional)</strong><p>Add a portrait to personalize your reception greeting.</p></div><span className="sanctuary-portrait-tabs">
          <button type="button" aria-pressed={portraitMode === "url"} onClick={() => setPortraitMode("url")}>Image URL</button>
          <button type="button" aria-pressed={portraitMode === "file"} disabled={!portraitUpload} title={portraitUpload ? undefined : "Portrait upload is unavailable"} onClick={() => setPortraitMode("file")}>Upload</button>
        </span></div>
        <div className="sanctuary-portrait-preview">
          <div className="sanctuary-portrait-avatar">
            <UserRound size={25} aria-hidden="true"/>
            {/* eslint-disable-next-line @next/next/no-img-element -- Portrait previews use browser object URLs and user-entered HTTPS URLs. */}
            {portrait && portrait !== previewFailed && <img key={portrait} src={portrait} referrerPolicy="no-referrer" alt="Portrait preview" onLoad={() => setPreviewLoaded(portrait)} onError={() => { setPreviewLoaded(""); setPreviewFailed(portrait); }}/>}
            {portrait && portrait === previewLoaded && <Check className="sanctuary-portrait-badge" size={14} aria-hidden="true"/>}
          </div>
          <div className="sanctuary-portrait-control">
            {portraitMode === "url" ? <span className="input-icon"><Link2 size={15} aria-hidden="true"/><input aria-label="Portrait image URL" type="url" pattern="https://.+" placeholder="https://example.com/portrait.jpg" value={portraitUrl} onChange={(event) => { setPreviewFailed(""); setPreviewLoaded(""); setPortraitUrl(event.target.value); }}/></span> :
              <input aria-label="Portrait file" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => {
                const file = event.target.files?.[0];
                const invalid = file && (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024);
                setPreviewFailed("");
                setPreviewLoaded("");
                setPortraitError(invalid ? "Choose a PNG, JPEG or WebP file up to 5 MB." : "");
                setPortraitFile(invalid ? undefined : file);
              }}/>}
            <small role="status">{portrait && portrait === previewFailed ? "The image preview could not load." : portrait && portrait === previewLoaded ? "Portrait preview ready." : portraitMode === "url" ? "Use a public HTTPS image link." : "PNG, JPEG or WebP, up to 5 MB."} {portraitUpload === false && "File upload is unavailable."}</small>
          </div>
        </div>
        {portraitMode === "file" && portraitError && <span role="alert">{portraitError}</span>}
      </div>}
      <div className="sanctuary-field">
        <div className="sanctuary-row"><label htmlFor="sanctuary-password">{register ? "Security passphrase" : "Private security passphrase"}</label>
          {register ? <small>Registration passphrase requirements</small> : <a href="#password-recovery">Forgot key?</a>}
        </div>
        <PasswordField id="sanctuary-password" minLength={register ? 8 : 1} maxLength={128}
          invalid={demo === "invalid"} describedBy={register ? "sanctuary-passphrase-rules" : undefined}
          autoComplete={register ? "new-password" : "current-password"} onChange={setPassword}
          placeholder="Enter your passphrase" pattern={register ? String.raw`(?=[\s\S]*[a-z])(?=[\s\S]*[A-Z])(?=[\s\S]*[0-9])(?=[\s\S]*[\p{P}\p{S}])[\s\S]{8,128}` : undefined}/>
      </div>
      {register ? <>
        <progress className="sanctuary-strength" value={strength} max={checks.length} aria-label="Passphrase requirements met"/>
        <div className="sanctuary-rules" id="sanctuary-passphrase-rules"><div className="sanctuary-row"><strong>Better Auth passphrase standards</strong><small aria-live="polite">{strength} of {checks.length} satisfied</small></div>
          <ul>{checks.map(({label, met}) => <li key={label} data-met={met}><CircleCheck size={14} aria-hidden="true"/>{label}</li>)}</ul>
        </div>
        <div className="sanctuary-assigned">
          <div className="sanctuary-row"><span>Assigned account role</span><small><LockKeyhole size={12} aria-hidden="true"/> Admin role restricted</small></div>
          <div className="sanctuary-security"><span className="sanctuary-role-icon"><UserRound size={17} aria-hidden="true"/></span><div><strong>Patron / Customer</strong><p>Reserve services and manage your appointments.</p></div><span className="sanctuary-locked"><LockKeyhole size={13} aria-hidden="true"/> Locked</span></div>
        </div>
        <label className="sanctuary-consent"><input name="terms" type="checkbox" required/><span>I agree to the <a href="#atelier-terms">atelier terms and privacy notice</a> and consent to session storage for my SalonBook account.</span></label>
      </> : <label className="sanctuary-consent"><input name="remember" type="checkbox"/><span>Remember this trusted device for 30 days</span></label>}
      <button className="button button-dark button-full" disabled={submitting || isPreview}>{submitting ? (register ? "Creating your account…" : "Signing in…") : register ? "Create Patron Account" : "Sign In to Your Sanctuary"} <ArrowRight size={16} aria-hidden="true"/></button>
      {(error || previewError) && <p className="sanctuary-notice sanctuary-error" role="alert">{previewError || error}</p>}
      {demo === "verified" && <p className="sanctuary-notice" role="status">Preview: verified state. No session was created and no redirect was made.</p>}
    </form>
    <div className="sanctuary-partners" aria-label="Atelier partners"><span>{register ? "Or authenticate with OAuth 2.0" : "Or continue with atelier partners"}</span><div>
      <button type="button" title={google === false ? "Google sign-in is unavailable" : undefined} disabled={submitting || isPreview || google !== true} onClick={continueWithGoogle}><span className="sanctuary-google" aria-hidden="true">G</span>{google === undefined ? "Checking Google sign-in" : google ? (register ? "Continue with Google" : "Google") : "Google unavailable"}</button>
      <button type="button" disabled><Apple size={16} aria-hidden="true"/> Apple unavailable</button>
    </div>{register && <small>Supported providers connect through Better Auth.</small>}</div>
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
