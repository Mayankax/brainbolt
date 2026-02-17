"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    async function bootstrap() {
      const existingToken = localStorage.getItem("token");

      if (existingToken) {
        router.replace("/dashboard");
        return;
      }

      const res = await api.post("/auth/anonymous");
      const newToken: string = res.data.token;

      localStorage.setItem("token", newToken);

      router.replace("/dashboard");
    }

    bootstrap();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted/40">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">
          Initializing BrainBolt...
        </p>
      </div>
    </div>
  );
}
