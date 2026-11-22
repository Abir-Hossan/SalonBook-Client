"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, CheckCircle2, Clock3, Wallet } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { EmptyState, SectionHeading, StatCard, StatusPill } from "@/components/ui";
import { ConfirmButton, SearchInput } from "@/components/interactive";
import { api, json, type Account, type ApiAppointment } from "@/lib/account-api";
import { dateLabel, money } from "@/lib/utils";
import type { Service } from "@/types";

type Record = ApiAppointment & { service?: Service };
type Stats = { totalAppointments: number; pending: number; confirmed: number; cancelled: number };

export function PatronDashboard({ account, mode }: { account: Account; mode: "overview" | "appointments" | "profile" }) {
  return <DashboardShell role="customer" account={account}>
    {mode === "profile" ? <PatronProfile account={account}/> : <PatronAppointments account={account} overview={mode === "overview"}/>}
  </DashboardShell>;
}

function PatronAppointments({ account, overview }: { account: Account; overview: boolean }) {
  const [rows, setRows] = useState<Record[]>([]);
  const [canPay, setCanPay] = useState(false);
  const [paying, setPaying] = useState<string>();
  const [stats, setStats] = useState<Stats>();
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState<Record>();
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError("");
      try {
        const query = new URLSearchParams({ limit: "100" });
        if (status !== "all" && !overview) query.set("status", status);
        const options = { signal: controller.signal };
        if (!overview) api<{stripe:boolean}>("/payments/availability", options).then((availability) => { if (!controller.signal.aborted) setCanPay(availability.stripe); }).catch(() => {});
        const [appointments, summary] = await Promise.all([
          api<ApiAppointment[]>("/appointments/my?" + query, options),
          overview ? api<Stats>("/customer/dashboard/stats", options) : Promise.resolve(undefined),
        ]);
        const services = new Map(await Promise.all([...new Set(appointments.map((row) => row.serviceId))].map(async (id) => {
          try { return [id, await api<Service>("/services/" + encodeURIComponent(id), options)] as const; }
          catch { return [id, undefined] as const; }
        })));
        if (!controller.signal.aborted) {
          setRows(appointments.map((row) => ({ ...row, service: services.get(row.serviceId) })));
          setStats(summary);
        }
      } catch (failure) {
        if (!controller.signal.aborted) setError(failure instanceof Error ? failure.message : "Could not load appointments.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [overview, refresh, status]);

  async function cancel(id: string) {
    setNotice("");
    setError("");
    try {
      await api("/appointments/" + encodeURIComponent(id) + "/cancel", { method: "PATCH" });
      setNotice("Appointment cancelled.");
      setRefresh((value) => value + 1);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Cancellation failed.");
    }
  }

  async function pay(id: string) {
    setPaying(id);
    setError("");
    try {
      const { url } = await api<{ url: string }>("/payments/checkout", json("POST", { appointmentId: id }));
      window.location.assign(url);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Checkout failed.");
      setPaying(undefined);
    }
  }

  const filtered = rows.filter((row) => {
    if (overview) return row.status !== "cancelled";
    return (row.service?.serviceName ?? row.id).toLowerCase().includes(search.toLowerCase());
  });
  const shown = overview ? filtered.slice(0, 4) : filtered.slice((page - 1) * 10, page * 10);
  return <>
    {overview ? <>
      <div className="dashboard-welcome"><div><p className="eyebrow">Patron portal</p><h1>Your Sanctuary Dossier <em>&amp; Upcoming Rituals</em></h1><p>Welcome back, {account.name}.</p></div>
        <Link className="button button-dark" href="/services">Explore experiences <ArrowUpRight size={15}/></Link></div>
      {stats && <div className="stats-grid">
        <StatCard label="Total requests" value={String(stats.totalAppointments)} icon={<CalendarDays size={18}/>}/>
        <StatCard label="Pending" value={String(stats.pending)} icon={<Clock3 size={18}/>}/>
        <StatCard label="Confirmed" value={String(stats.confirmed)} icon={<CheckCircle2 size={18}/>}/>
        <StatCard label="Cancelled" value={String(stats.cancelled)} icon={<Wallet size={18}/>}/>
      </div>}
      <SectionHeading eyebrow="Your next moment" title="Upcoming appointments" action={<Link href="/customer/appointments">View all</Link>}/>
    </> : <>
      <SectionHeading eyebrow="Your beauty journal" title="My Appointments & Aesthetic Itineraries" action={<Link className="button button-dark" href="/services">New appointment</Link>}/>
      <div className="table-toolbar"><SearchInput value={search} onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search appointments"/>
        <div className="filter-pills">{["all","pending","confirmed","cancelled"].map((value) => <button type="button" key={value} aria-pressed={status === value} className={status === value ? "selected" : ""} onClick={() => { setStatus(value); setPage(1); }}>{value}</button>)}</div>
      </div>
    </>}
    {notice && <p role="status">{notice}</p>}
    {error && <p role="alert">{error} <button className="table-action" onClick={() => setRefresh((value) => value + 1)}>Retry</button></p>}
    {loading ? <p role="status">Loading appointments…</p> : shown.length ? <div className="appointment-list">{shown.map((row) => <article key={row.id} className="appointment-card">
      {row.service?.image && <Image src={row.service.image} width={110} height={110} alt=""/>}
      <div className="appointment-card-main"><span className="eyebrow">{row.id}</span><h3>{row.service?.serviceName ?? "Appointment"}</h3><p>{dateLabel(row.appointmentDate)} · {row.timeSlot}</p><div className="appointment-badges"><StatusPill status={row.status}/><StatusPill status={row.paymentStatus}/></div><button className="table-action" onClick={() => setSelected(row)}>View details</button></div>
      <div className="appointment-card-end"><b>{money(row.servicePrice)}</b>{!overview && canPay && row.status === "confirmed" && row.paymentStatus === "unpaid" && <button className="button button-dark button-xs" disabled={Boolean(paying)} onClick={() => void pay(row.id)}>{paying === row.id ? "Opening checkout…" : "Pay now"}</button>}{!overview && row.status === "pending" && <ConfirmButton label="Cancel appointment" confirmTitle="Cancel this appointment?" confirmText="It will stay in your history." onConfirm={() => { void cancel(row.id); return false; }}/>}</div>
    </article>)}</div> : !error && <EmptyState title="No appointments found" description="Browse services to plan your next visit." action={<Link href="/services">Explore services</Link>}/>}
    {!overview && filtered.length > 10 && <div className="button-row"><button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span>Page {page}</span><button type="button" disabled={page * 10 >= filtered.length} onClick={() => setPage(page + 1)}>Next</button></div>}
    {selected && <div className="confirmation-backdrop"><section className="confirmation-dialog" role="dialog" aria-modal="true" aria-label="Appointment details"><h3>{selected.service?.serviceName ?? "Appointment"}</h3><p>{dateLabel(selected.appointmentDate)} · {selected.timeSlot}</p><p>{money(selected.servicePrice)} · {selected.status} · {selected.paymentStatus}</p><button className="button button-outline" onClick={() => setSelected(undefined)}>Close</button></section></div>}
    {overview && <section className="dashboard-promo"><div><p className="eyebrow">A note from the atelier</p><h3>Make a little room for something lovely.</h3><Link className="text-link" href="/services">Discover the collection <ArrowUpRight size={14}/></Link></div></section>}
  </>;
}

export function PatronProfile({ account }: { account: Account }) {
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    setBusy(true);
    setFeedback("");
    try {
      let image = String(fields.get("image")).trim();
      const photo = fields.get("photo");
      if (photo instanceof File && photo.size) image = (await api<{image:string}>("/images/profile", { method: "POST", headers: { "Content-Type": photo.type }, body: photo })).image;
      await api("/users/profile", json("PATCH", { name: String(fields.get("name")), ...(image ? { image } : {}) }));
      setFeedback("Profile saved. Refresh to see changes in your dashboard.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Profile update failed.");
    } finally {
      setBusy(false);
    }
  }
  return <><SectionHeading eyebrow="Patron details" title="My profile"/><form className="panel profile-form form-stack" onSubmit={save}>
    <label className="field"><span>Full name</span><input required name="name" defaultValue={account.name} minLength={2} maxLength={80}/></label>
    <label className="field"><span>Email</span><input readOnly value={account.email}/></label>
    <label className="field"><span>Profile image URL</span><input name="image" type="url" defaultValue={account.image ?? ""}/></label>
    <label className="field"><span>Upload portrait</span><input name="photo" type="file" accept="image/png,image/jpeg,image/webp"/></label>
    <button className="button button-dark" disabled={busy}>{busy ? "Saving…" : "Save changes"}</button>
    {feedback && <p role="status">{feedback}</p>}
  </form></>;
}
