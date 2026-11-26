import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, Headset } from "lucide-react";
import type { ReactNode } from "react";
import { PublicHeader } from "@/components/header";
import { Footer } from "@/components/footer";
import { AuthShowcasePanel, AuthShowcaseProvider } from "@/components/auth-showcase";
import "./auth-shell.css";

const content = {
  login: {
    label: "Patron Portal", detail: "Private Client Sanctuary",
    title: "Welcome Back to Your", accent: "Beauty Space.",
    copy: "Step back into serene spaces, considered care, and bespoke beauty rituals.",
    cards: [["Acoustic Stillness", "Soundproof suites"], ["Master Artisans", "Curated hair and skin specialists"], ["Discreet Care", "Dedicated private concierge"]],
  },
  register: {
    label: "Patron Onboarding", detail: "Exclusive Atelier Membership",
    title: "Begin Your Aesthetic", accent: "Journey.",
    copy: "Enter a curated world of bespoke rituals, architectural stillness, and master artisans.",
    cards: [["Curated Concierge Access", "Priority appointments with our specialist team."], ["Acoustic Solitude Suites", "Quiet appointments and private spaces."], ["Private Formulation Dossier", "Personalised treatment notes and preferences."]],
  },
};

export function AuthShell({ mode, children }: { mode: keyof typeof content; children: ReactNode }) {
  const page = content[mode];
  const register = mode === "register";
  const showDemo = process.env.NODE_ENV === "development";
  const shell = <div className="sanctuary-auth">
    <PublicHeader/>
    <main className={`sanctuary-split sanctuary-${mode}`}>
      <aside className="sanctuary-visual" aria-label="The SalonBook experience">
        <Image src={register ? "/images/auth-sign-up.png" : "/images/auth-sign-in.png"} alt="" fill priority sizes="(max-width: 760px) 100vw, 50vw"/>
        <div className="sanctuary-badges"><span>{!register && <b>SB</b>} {page.label}</span><span><BadgeCheck size={16}/> {page.detail}</span></div>
        <div className="sanctuary-story">
          {!register && <span className="sanctuary-hospitality">Discreet hospitality</span>}
          <p className="sanctuary-display">{page.title}<br/><em>{page.accent}</em></p>
          <p className="sanctuary-copy">{page.copy}</p>
        </div>
        <div className="sanctuary-features">{page.cards.map(([title, detail]) => <div key={title}><strong>{title}</strong><span>{detail}</span></div>)}</div>
        <div className="sanctuary-location"><span>Madison Ave · Bond St · Place Vendôme</span><span>Est. 2021</span></div>
      </aside>
      <section className="sanctuary-side">
        {showDemo && register && <AuthShowcasePanel register/>}
        <Link className="sanctuary-back" href={register ? "/" : "/services"}><ArrowLeft size={17}/>{register ? "Return to Atelier Discovery" : "Return to Atelier Services"}</Link>
        {showDemo && !register && <AuthShowcasePanel register={false}/>}
        {children}
        <div className="sanctuary-concierge"><Headset size={15} aria-hidden="true"/> <span>{register ? "Require discreet personal booking assistance?" : "Need discreet concierge access?"} <a href="tel:+18004287690">+1 (800) 428-7690</a></span></div>
      </section>
    </main>
    <Footer auth/>
  </div>;
  return showDemo ? <AuthShowcaseProvider>{shell}</AuthShowcaseProvider> : shell;
}
