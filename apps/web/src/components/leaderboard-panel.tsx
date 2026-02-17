"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import api from "@/lib/api";

function normalizeRedisLeaderboard(raw: any) {
  if (!Array.isArray(raw)) return [];

  const result = [];

  for (let i = 0; i < raw.length; i += 2) {
    const userId = raw[i];
    const scoreRaw = raw[i + 1];

    const score = Number(scoreRaw);

    if (userId && !Number.isNaN(score)) {
      result.push({
        userId,
        score,
      });
    }
  }

  return result;
}

export default function LeaderboardPanel() {
  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard-score"],
    queryFn: async () => {
      const res = await api.get("/leaderboard/score");
      return normalizeRedisLeaderboard(res.data);
    },
    refetchInterval: 3000,
  });

  if (isLoading) {
    return <Card className="p-6">Loading...</Card>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Top Scores</h2>

      {(!data || data.length === 0) && (
        <p className="text-muted-foreground text-sm">
          No scores yet.
        </p>
      )}

      <div className="space-y-3">
        {data?.slice(0, 10).map((entry, index) => (
          <div
            key={entry.userId}
            className="flex justify-between text-sm border-b pb-2"
          >
            <span>#{index + 1}</span>

            <span className="truncate max-width: 120px;">
              {entry.userId.slice(0, 8)}
            </span>

            <span>{Math.round(entry.score)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
