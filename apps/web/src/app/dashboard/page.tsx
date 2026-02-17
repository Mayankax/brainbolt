"use client";

import LeaderboardPanel from "@/components/leaderboard-panel";
import QuizPanel from "@/components/quiz-panel";
import StatsBar from "@/components/stats-bar";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/");
    }
  }, [router]);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <StatsBar />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <QuizPanel />
          </div>
          <div>
            <LeaderboardPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
