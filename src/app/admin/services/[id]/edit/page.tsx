import { requireAccount } from "@/lib/server-account";
import { AtelierDashboard } from "@/components/atelier-dashboard";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, account] = await Promise.all([params, requireAccount("admin")]);
  return <AtelierDashboard account={account} mode="editor" serviceId={id}/>;
}
