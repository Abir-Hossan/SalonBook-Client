import type { ReactNode } from "react";
import { requireAccount } from "@/lib/server-account";
export default async function CustomerLayout({ children }: { children: ReactNode }) {
  await requireAccount("customer");
  return children;
}
