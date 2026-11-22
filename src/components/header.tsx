"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { api, type Account } from "@/lib/account-api";
import { Menu, X, ArrowUpRight, UserRound } from "lucide-react";

const links = [
  ["Home", "/"],
  ["Browse Services", "/services"],
  ["The Experience", "/#experience"],
  ["Artisans", "/#philosophy"],
  ["Journal", "/#atelier"],
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const [account, setAccount] = useState<Account>();
  const pathname = usePathname();
  useEffect(() => {
    const controller = new AbortController();
    api<Account>("/auth/me", { signal: controller.signal }).then(setAccount).catch(() => {
      if (!controller.signal.aborted) setAccount(undefined);
    });
    return () => controller.abort();
  }, [pathname]);
  const accountPath = account ? (account.role === "admin" ? "/admin" : "/customer") : "/sign-in";
  const accountLabel = account ? "My account" : "Sign in";
  return <header className="public-header"><div className="header-inner">
    <Link href="/" className="brand" aria-label="SalonBook home"><span className="brand-mark">S</span><span>SALONBOOK<small>THE BEAUTY SANCTUARY</small></span></Link>
    <nav className="desktop-nav" aria-label="Main navigation">{links.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}</nav>
    <div className="header-actions"><Link href={accountPath} className="header-login">{accountLabel}</Link><Link href="/services" className="button button-dark button-small">Reserve Treatment <ArrowUpRight size={14}/></Link><Link href={accountPath} className="header-account" aria-label="Your account"><UserRound size={16}/></Link></div>
    <button className="mobile-menu-button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
  </div>{open && <nav className="mobile-nav" aria-label="Mobile navigation">{links.map(([label, href]) => <Link onClick={() => setOpen(false)} key={label} href={href}>{label}</Link>)}<Link href={accountPath} onClick={() => setOpen(false)}>{accountLabel}</Link><Link href="/services" onClick={() => setOpen(false)}>Reserve Treatment</Link></nav>}</header>;
}
