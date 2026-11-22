import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { AppointmentStatus, PaymentStatus } from "@/types";

export function Eyebrow({children,className=""}:{children:ReactNode;className?:string}) {
  return <p className={cn("eyebrow",className)}>{children}</p>;
}
export function SectionHeading({eyebrow,title,description,action}:{eyebrow?:string;title:string;description?:string;action?:ReactNode}) {
  return <div className="section-heading"><div>{eyebrow&&<Eyebrow>{eyebrow}</Eyebrow>}<h2>{title}</h2>{description&&<p>{description}</p>}</div>{action}</div>;
}
export function StatusPill({status}:{status:AppointmentStatus|PaymentStatus|"active"|"inactive"|"blocked"|"failed"|"paid"}) {
  const labels:Record<string,string>={pending:"Pending",confirmed:"Confirmed",cancelled:"Cancelled",unpaid:"Unpaid",paid:"Paid",active:"Active",inactive:"Inactive",blocked:"Blocked",failed:"Failed"};
  return <span className={`status status-${status}`}>{labels[status]??status}</span>;
}
export function StatCard({label,value,change,icon}:{label:string;value:string|number;change?:string;icon:ReactNode}) {
  return <article className="stat-card"><div className="stat-top"><span>{label}</span><span className="stat-icon">{icon}</span></div><strong>{value}</strong>{change&&<small>{change}</small>}</article>;
}
export function EmptyState({title,description,action}:{title:string;description:string;action?:ReactNode}) {
  return <div className="empty-state"><span className="empty-mark">✳</span><h3>{title}</h3><p>{description}</p>{action}</div>;
}
export function PageLoader({label="Preparing your experience"}:{label?:string}) {
  return <div className="page-loader"><span className="loader-ring"/><p>{label}</p></div>;
}
