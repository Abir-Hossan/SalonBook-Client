"use client";

import { useDeferredValue, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, CreditCard, Scissors, Users } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { ConfirmButton, SearchInput } from "@/components/interactive";
import { SectionHeading, StatCard, StatusPill } from "@/components/ui";
import { PatronProfile } from "@/components/patron-dashboard";
import { api, apiPage, json, type Account } from "@/lib/account-api";
import type { Service } from "@/types";
import type { ComponentProps } from "react";
import { money } from "@/lib/utils";

type Mode = "overview" | "services" | "appointments" | "users" | "transactions" | "profile" | "editor";
type Entry = { id: string; [key: string]: string | number | boolean | undefined };
const lists = {
  services: { title: "Manage services", path: "/services?includeInactive=true", fields: ["serviceName","category","price","status"] },
  appointments: { title: "Manage appointments", path: "/admin/appointments", fields: ["id","appointmentDate","timeSlot","status","paymentStatus"] },
  users: { title: "Manage customers", path: "/admin/users?role=customer", fields: ["name","email","isBlocked"] },
  transactions: { title: "Transactions", path: "/admin/transactions", fields: ["appointmentId","amount","currency","status","createdAt"] },
};

export function AtelierDashboard({ account, mode, serviceId }: { account: Account; mode: Mode; serviceId?: string }) {
  return <DashboardShell role="admin" account={account}>
    {mode === "profile" ? <PatronProfile account={account}/> : mode === "editor" ? <ServiceEditor serviceId={serviceId}/> :
      mode === "overview" ? <AtelierOverview/> : <AtelierList mode={mode}/>}
  </DashboardShell>;
}

function AtelierOverview() {
  const [stats, setStats] = useState<Record<string, number>>();
  const [error, setError] = useState("");
  useEffect(() => { const controller = new AbortController();
    api<Record<string, number>>("/admin/dashboard/stats", { signal: controller.signal }).then(setStats).catch((failure) => { if (!controller.signal.aborted) setError(failure.message); });
    return () => controller.abort();
  }, []);
  return <><SectionHeading eyebrow="Atelier governance" title="Dashboard overview"/>
    {error ? <p role="alert">{error}</p> : stats ? <div className="stats-grid">
      {[["appointments",CalendarDays],["services",Scissors],["users",Users],["transactions",CreditCard]].map(([key, Icon]) => {
        if (typeof key !== "string" || typeof Icon === "string") return null;
        const Figure = Icon as typeof CalendarDays;
        return <StatCard key={key} label={key} value={String(stats[key] ?? 0)} icon={<Figure size={18}/>}/>;
      })}
    </div> : <p role="status">Loading dashboard…</p>}</>;
}

function AtelierList({ mode }: { mode: keyof typeof lists }) {
  const { title, path, fields } = lists[mode];
  const [entries, setEntries] = useState<Entry[]>();
  const [query, setQuery] = useState("");
  const search = useDeferredValue(query);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setError("");
    const [endpoint, defaults] = path.split("?");
    const params = new URLSearchParams(defaults);
    params.set("page", String(page));
    params.set("limit", "20");
    if (search.trim()) params.set("q", search.trim());
    apiPage<Entry>(endpoint + "?" + params, { signal: controller.signal }).then((result) => {
      if (controller.signal.aborted) return;
      setEntries(result.data);
      setTotalPages(result.totalPages);
      if (page > result.totalPages) setPage(result.totalPages);
    }).catch((failure) => {
      if (!controller.signal.aborted) setError(failure.message);
    });
    return () => controller.abort();
  }, [page, path, retry, search]);

  async function mutate(path: string, method = "PATCH") {
    setError("");
    setNotice("");
    try {
      await api(path, { method });
      setNotice("Changes saved.");
      setRetry((value) => value + 1);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "The change failed.");
    }
  }

  return <><SectionHeading eyebrow="Atelier governance" title={title} action={mode === "services" && <Link href="/admin/services/new" className="button button-dark">New service</Link>}/>
    <div className="table-toolbar"><SearchInput value={query} onChange={(value) => { setQuery(value); setPage(1); }} placeholder={"Search " + mode}/></div>
    {notice && <p role="status">{notice}</p>}
    {error && <p role="alert">{error} <button className="table-action" onClick={() => setRetry((value) => value + 1)}>Retry</button></p>}
    {!entries && !error ? <p role="status">Loading {mode}…</p> : entries?.length ? <div className="table-wrap"><table>
      <thead><tr>{fields.map((field) => <th key={field}>{field.replace(/([A-Z])/g, " $1")}</th>)}{mode !== "transactions" && <th>Actions</th>}</tr></thead>
      <tbody>{entries.map((row) => <tr key={row.id}>
        {fields.map((field) => <td key={field}>{["status","paymentStatus"].includes(field) ? <StatusPill status={String(row[field]) as ComponentProps<typeof StatusPill>["status"]}/> : ["price","amount"].includes(field) ? money(Number(row[field])) : field === "isBlocked" ? row.isBlocked ? "Blocked" : "Active" : String(row[field] ?? "—")}</td>)}
        {mode !== "transactions" && <td><div className="row-actions">
          {mode === "services" && <><Link className="table-action" href={"/admin/services/" + encodeURIComponent(row.id) + "/edit"}>Edit</Link><ConfirmButton label="Delete" confirmTitle="Delete this service?" confirmText="Services with appointments cannot be deleted." onConfirm={() => { void mutate("/services/" + encodeURIComponent(row.id), "DELETE"); return false; }}/></>}
          {mode === "appointments" && row.status === "pending" && <button className="table-action" onClick={() => void mutate("/admin/appointments/" + row.id + "/confirm")}>Confirm</button>}
          {mode === "appointments" && (row.status === "pending" || row.status === "confirmed") && <ConfirmButton label="Cancel" confirmTitle="Cancel this appointment?" confirmText="The record remains in appointment history." onConfirm={() => { void mutate("/admin/appointments/" + row.id + "/cancel"); return false; }}/>}
          {mode === "users" && <ConfirmButton label={row.isBlocked ? "Unblock" : "Block"} confirmTitle="Change account access?" confirmText="This affects the customer's ability to sign in." onConfirm={() => { void mutate("/admin/users/" + row.id + (row.isBlocked ? "/unblock" : "/block")); return false; }}/>}
        </div></td>}
      </tr>)}</tbody>
    </table></div> : !error && <p>No {mode} found.</p>}
    {totalPages > 1 && <div className="button-row"><button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span>Page {page} of {totalPages}</span><button type="button" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button></div>}
  </>;
}

function ServiceEditor({ serviceId }: { serviceId?: string }) {
  const router = useRouter();
  const [service, setService] = useState<Service>();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!serviceId) return;
    const controller = new AbortController();
    api<Service>("/services/" + encodeURIComponent(serviceId) + "?includeInactive=true", { signal: controller.signal })
      .then(setService).catch((failure) => { if (!controller.signal.aborted) setError(failure.message); });
    return () => controller.abort();
  }, [serviceId]);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      let image = String(form.get("image")).trim();
      const photo = form.get("photo");
      if (photo instanceof File && photo.size) image = (await api<{ image: string }>("/admin/images/service", { method: "POST", headers: { "Content-Type": photo.type }, body: photo })).image;
      if (!image) throw new Error("Enter an image URL or upload a service photo.");
      await api("/services" + (serviceId ? "/" + encodeURIComponent(serviceId) : ""), json(serviceId ? "PATCH" : "POST", {
        serviceName: String(form.get("name")), category: String(form.get("category")), description: String(form.get("description")),
        price: Number(form.get("price")), duration: Number(form.get("duration")), image, status: String(form.get("status")),
      }));
      router.push("/admin/services");
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Service save failed.");
    } finally { setBusy(false); }
  }
  return <><SectionHeading eyebrow="Atelier collection" title={serviceId ? "Edit service" : "Create a service"} action={<Link href="/admin/services">Back to services</Link>}/>
    {error && <p role="alert">{error}</p>}
    {serviceId && !service ? !error && <p role="status">Loading service…</p> : <form className="panel profile-form form-stack" onSubmit={save}>
      <label className="field"><span>Service name</span><input name="name" required minLength={2} defaultValue={service?.serviceName}/></label>
      <label className="field"><span>Category</span><input name="category" required minLength={2} defaultValue={service?.category}/></label>
      <label className="field"><span>Description</span><textarea name="description" required minLength={10} defaultValue={service?.description}/></label>
      <label className="field"><span>Price (USD)</span><input name="price" required type="number" min=".01" step=".01" defaultValue={service?.price}/></label>
      <label className="field"><span>Duration (minutes)</span><input name="duration" required type="number" min="1" defaultValue={service?.duration}/></label>
      <label className="field"><span>Image URL</span><input name="image" type={service?.image?.startsWith("/") ? "text" : "url"} defaultValue={service?.image}/></label>
      <label className="field"><span>Upload image</span><input name="photo" type="file" accept="image/png,image/jpeg,image/webp"/></label>
      <label className="field"><span>Status</span><select name="status" defaultValue={service?.status ?? "active"}><option value="active">Active</option><option value="inactive">Inactive</option></select></label>
      <button className="button button-dark" disabled={busy}>{busy ? "Saving…" : "Save service"}</button>
    </form>}</>;
}
