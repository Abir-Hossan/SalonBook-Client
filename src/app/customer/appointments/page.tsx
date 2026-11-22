import { requireAccount } from "@/lib/server-account";
import { PatronDashboard } from "@/components/patron-dashboard";
export default async function Page() {
  return <PatronDashboard account={await requireAccount("customer")} mode="appointments"/>;
}
