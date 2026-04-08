"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-apex-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-apex-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-apex-text-secondary text-sm">Loading APEX GTM...</p>
      </div>
    </div>
  );
}
