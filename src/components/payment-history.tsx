"use client";
import { useEffect, useState } from "react";
import { apiPage } from "@/lib/account-api";
import { SectionHeading } from "./ui";

type Transaction = { id: string; appointmentId: string; amount: number; currency: string; status: string; createdAt: string };

export function PaymentHistory() {
  const [entries, setEntries] = useState<Transaction[]>();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [retry, setRetry] = useState(0);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    apiPage<Transaction>("/transactions/my?limit=20&page=" + page, { signal: controller.signal }).then((result) => {
      if (controller.signal.aborted) return;
      setEntries(result.data);
      setPages(result.totalPages);
      setError("");
    }).catch((failure: unknown) => {
      if (!controller.signal.aborted) setError(failure instanceof Error ? failure.message : "Payment history could not be loaded.");
    });
    return () => controller.abort();
  }, [page, retry]);
  return <>
    <SectionHeading eyebrow="Patron portal" title="Payment history"/>
    {error ? <p role="alert">{error} <button type="button" onClick={() => setRetry((value) => value + 1)}>Retry</button></p>
      : !entries ? <p role="status">Loading payments.</p>
      : entries.length === 0 ? <p>No payments yet.</p>
      : <div className="table-wrap"><table>
        <thead><tr><th>Appointment</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>{entries.map((entry) => <tr key={entry.id}><td>{entry.appointmentId}</td>
          <td>{new Intl.NumberFormat("en-US", { style: "currency", currency: entry.currency }).format(entry.amount)}</td>
          <td>{entry.status}</td><td>{new Date(entry.createdAt).toLocaleDateString()}</td>
        </tr>)}</tbody>
      </table></div>}
    {pages > 1 && <div className="button-row">
      <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
      <span>Page {page} of {pages}</span>
      <button type="button" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button>
    </div>}
  </>;
}
