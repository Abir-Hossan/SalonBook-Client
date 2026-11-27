import { DashboardShell } from "@/components/dashboard-shell";
import { PaymentHistory } from "@/components/payment-history";
import { requireAccount } from "@/lib/server-account";

export default async function CustomerTransactions() {
  const account = await requireAccount("customer");
  return <DashboardShell role="customer" account={account}><PaymentHistory/></DashboardShell>;
}
