// components/ClientHeader.tsx
"use client"; // Yalnızca bu bileşen istemci tarafında çalışacak

import { usePathname } from "next/navigation";
import Header from "./header";

export default function ClientHeader() {
  const pathname = usePathname();

  const hideHeaderOnPaths = ["/login", "/register", "/"];
  const shouldHideHeader = hideHeaderOnPaths.includes(pathname);

  return !shouldHideHeader ? <Header  /> : null;
}
