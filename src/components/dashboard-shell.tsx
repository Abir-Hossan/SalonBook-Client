"use client";
import Link from "next/link";
import Image from "next/image";
import { api, type Account } from "@/lib/account-api";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { LayoutDashboard, CalendarDays, UserRound, Scissors, Users, CreditCard, Menu, X, LogOut, ArrowUpRight } from "lucide-react";
import "./customer-reference.css";
import { currentAdmin,currentCustomer } from "@/mock/data";
const customerLinks=[{label:"Overview",href:"/demo/customer",icon:LayoutDashboard},{label:"My Appointments",href:"/demo/customer/appointments",icon:CalendarDays},{label:"My Profile",href:"/demo/customer/profile",icon:UserRound}];
const adminLinks=[{label:"Overview",href:"/admin",icon:LayoutDashboard},{label:"Manage Services",href:"/admin/services",icon:Scissors},{label:"Appointments",href:"/admin/appointments",icon:CalendarDays},{label:"Customers",href:"/admin/users",icon:Users},{label:"Transactions",href:"/admin/transactions",icon:CreditCard},{label:"My Profile",href:"/admin/profile",icon:UserRound}];
export function DashboardShell({role,account,children}:{role:"customer"|"admin";account?:Account;children:ReactNode}){
 const [open,setOpen]=useState(false); const pathname=usePathname(); const admin=role==="admin"; const user=account ?? (admin?currentAdmin:currentCustomer); const links=admin?adminLinks:account?customerLinks.map(link=>({...link,href:link.href.replace("/demo","")})):customerLinks;
 const navigation = account && !admin ? [...links.slice(0, 2), { label: "Payment history", href: "/customer/transactions", icon: CreditCard }, ...links.slice(2)] : links;
 const [date,setDate]=useState("");
 useEffect(() => {
  if (!account?.id) return;
  const controller = new AbortController();
  void fetch("/api/better-auth/get-session", { cache: "no-store", signal: controller.signal }).catch(() => {});
  return () => controller.abort();
 }, [account?.id]);
 useEffect(()=>{setDate(new Intl.DateTimeFormat("en-US",{dateStyle:"full"}).format(new Date()));},[]);
 return <div className={admin?"dashboard-layout":"dashboard-layout customer-reference"}>
  <aside className={`dashboard-sidebar ${open?"sidebar-open":""}`}><Link href="/" className="brand sidebar-brand"><span className="brand-mark">S</span><span>SALONBOOK<small>THE BEAUTY SANCTUARY</small></span></Link>
   <div className="sidebar-label">{admin?"ADMINISTRATION":(account?"PATRON PORTAL":"DEMO CUSTOMER")}</div><nav className="sidebar-nav">{navigation.map(item=>{const active=pathname===item.href||(item.href!==(admin?"/admin":account?"/customer":"/demo/customer")&&pathname.startsWith(item.href));const Icon=item.icon;return <Link key={item.href} href={item.href} onClick={()=>setOpen(false)} aria-current={active?"page":undefined} className={active?"active":""}><Icon size={17}/>{item.label}{active&&<span className="nav-active-dot"/>}</Link>})}</nav>
   <div className="sidebar-bottom"><div className="sidebar-note"><span className="note-flower">✳</span><b>{admin?"A thoughtful space.":"Your moment, made."}</b><p>{admin?"Every detail, beautifully considered.":"A little time for yourself goes a long way."}</p><Link href="/services">Explore services <ArrowUpRight size={13}/></Link></div><div className="sidebar-user">{user.image && <Image src={user.image} alt="" width={38} height={38}/>}<span><b>{user.name}</b><small>{admin?"Administrator":"Patron"}</small></span><button type="button" aria-label={account?"Sign out":"Exit demo"} onClick={async()=>{try{if(account)await api("/auth/sign-out",{method:"POST"});window.location.replace("/sign-in");}catch{toast.error("Sign-out failed. Try again.");}}}><LogOut size={16}/></button></div></div>
  </aside>
  <main className="dashboard-main"><header className="dashboard-topbar"><button className="mobile-menu-button dashboard-menu" onClick={()=>setOpen(!open)} aria-label="Toggle navigation">{open?<X/>:<Menu/>}</button><div><span className="topbar-kicker">{admin?"SALONBOOK / GOVERNANCE":(account?"SALONBOOK / PATRON PORTAL":"SALONBOOK / DEMO CUSTOMER")}</span><p>{admin?"Atelier administration":(account?user.name:"Browser-local appointment preview")}</p></div><div className="topbar-right"><span className="topbar-date">{date}</span><span className="topbar-avatar">{user.name.split(" ").map(x=>x[0]).join("")}</span></div></header><div className="dashboard-content">{children}</div></main>
  {open&&<button className="sidebar-scrim" aria-label="Close navigation" onClick={()=>setOpen(false)}/>}
 </div>
}
