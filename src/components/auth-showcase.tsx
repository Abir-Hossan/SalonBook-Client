"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";

type ShowcaseState = "normal" | "invalid" | "loading" | "failure" | "verified";
type NavbarPreview = "guest" | "customer";
const Showcase = createContext<{
  state: ShowcaseState;
  setState: (state: ShowcaseState) => void;
  navbar?: NavbarPreview;
  setNavbar: (navbar: NavbarPreview) => void;
} | null>(null);

export const useAuthShowcase = () => useContext(Showcase);

export function AuthShowcaseProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ShowcaseState>("normal");
  const [navbar, setNavbar] = useState<NavbarPreview>();
  return <Showcase.Provider value={{ state, setState, navbar, setNavbar }}>{children}</Showcase.Provider>;
}

export function AuthShowcasePanel({ register }: { register: boolean }) {
  const preview = useAuthShowcase();
  if (!preview) return null;
  const states: [ShowcaseState, string][] = register
    ? [["normal", "Standard Form"], ["invalid", "Validation Errors"], ["failure", "Email Conflict"], ["loading", "Submitting State"], ["verified", "Success & Redirect"]]
    : [["normal", "Normal"], ["invalid", "Invalid"], ["loading", "Loading"], ["failure", "Auth Fail"], ["verified", "Verified"]];
  return <section className="sanctuary-showcase" aria-label="Development authentication preview">
    <div className="sanctuary-row"><strong>{register ? <><SlidersHorizontal size={13}/> Interactive state simulator</> : <>● State showcase demo</>}</strong>{!register && <span>Click state to preview</span>}</div>
    <div className="sanctuary-showcase-states">{states.map(([key, label]) => <button key={key} type="button" aria-pressed={preview.state === key} onClick={() => preview.setState(key)}>{label}</button>)}</div>
    {register && <div className="sanctuary-showcase-nav sanctuary-row"><span>Navbar preview switch:</span><div><button type="button" aria-pressed={preview.navbar === "guest"} onClick={() => preview.setNavbar("guest")}>Guest Nav</button><button type="button" aria-pressed={preview.navbar === "customer"} onClick={() => preview.setNavbar("customer")}>Authenticated Nav</button></div></div>}
  </section>;
}

