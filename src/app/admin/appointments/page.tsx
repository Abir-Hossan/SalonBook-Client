import { requireAccount } from "@/lib/server-account";
import { AtelierDashboard } from "@/components/atelier-dashboard";
export default async function Page() {
  return <AtelierDashboard account={await requireAccount("admin")} mode="appointments"/>;
}
