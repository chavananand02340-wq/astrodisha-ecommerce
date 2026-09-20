"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkIsAdmin } from "@/lib/adminAuth";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "authorized" | "unauthorized">("checking");

  useEffect(() => {
    let isMounted = true;

    async function verify() {
      const isAdmin = await checkIsAdmin();

      if (!isMounted) return;

      if (isAdmin) {
        setStatus("authorized");
      } else {
        setStatus("unauthorized");
        router.push("/admin/login");
      }
    }

    verify();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (status === "checking") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F7F3EC",
          color: "#3E2237",
        }}
      >
        Checking admin access...
      </div>
    );
  }

  if (status === "unauthorized") {
    return null;
  }

  return <>{children}</>;
}
