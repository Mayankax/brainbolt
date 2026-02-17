"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Flame, Trophy } from "lucide-react";

export default function StatsBar() {
  const { data } = useQuery({
    queryKey: ["metrics"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await api.get("/quiz/metrics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 flex justify-between items-center">
        <div>
          <p className="text-muted-foreground text-sm">Total Score</p>
          <p className="text-2xl font-bold">
            {Math.round(data?.totalScore || 0)}
          </p>
        </div>
        <Trophy className="w-8 h-8 text-yellow-500" />
      </Card>

      <Card className="p-6 flex justify-between items-center">
        <div>
          <p className="text-muted-foreground text-sm">Current Streak</p>
          <p
            className={`text-2xl font-bold transition-all ${
              data?.streak >= 3
                ? "text-orange-500 drop-shadow-[0_0_8px_rgba(255,140,0,0.8)]"
                : ""
            }`}
          >
            {data?.streak || 0}
          </p>

        </div>
        <Flame className="w-8 h-8 text-orange-500" />
      </Card>

      <Card className="p-6">
        <p className="text-muted-foreground text-sm">Accuracy</p>
        <p className="text-2xl font-bold">
          {data?.accuracy?.toFixed(1) || 0}%
        </p>
      </Card>
    </div>
  );
}
