// components/ClientHeader.tsx
"use client"; // Yalnızca bu bileşen istemci tarafında çalışacak

import { usePathname } from "next/navigation";
import Header from "./header";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientHeader() {
  const pathname = usePathname();

  const hideHeaderOnPaths = ["/login", "/register", "/"];
  const shouldHideHeader = hideHeaderOnPaths.includes(pathname);

  return (
    <AnimatePresence>
      {!shouldHideHeader && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
        >
          <Header />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
