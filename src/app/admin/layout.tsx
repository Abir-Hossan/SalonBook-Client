import type { ReactNode } from "react";
import { requireAccount } from "@/lib/server-account";
export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAccount("admin");
  return children;
}
