"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function QuizPanel() {
  const [selected, setSelected] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["next-question"],
    queryFn: async () => {
      const res = await api.get("/quiz/next");
      return res.data;
    },
  });

  async function submitAnswer() {
    if (!selected || !data) return;

    try {
      const response = await api.post("/quiz/answer", {
        questionId: data.questionId,
        answer: selected,
        stateVersion: data.stateVersion,
        idempotencyKey: crypto.randomUUID(),
      });

      if (response.data.correct) {
        toast.success("Correct Answer!", {
          description: `+${Math.round(
            Number(response.data.scoreDelta || 0)
          )} points`,
        });
      } else {
        toast.error("Incorrect Answer", {
          description: "Keep pushing forward",
        });
      }

      setSelected(null);

      // Instantly refresh dependent UI
      queryClient.invalidateQueries({ queryKey: ["leaderboard-score"] });
      queryClient.invalidateQueries({ queryKey: ["metrics"] });

      refetch();
    } catch (error: any) {
      if (error?.response?.status === 409) {
        toast.warning("State out of sync", {
          description: "Refreshing question...",
        });
        refetch();
      } else if (error?.response?.status === 401) {
        toast.error("Session expired");
        localStorage.removeItem("token");
        window.location.href = "/";
      } else {
        toast.error("Something went wrong");
      }
    }
  }



  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-xl" />;
  }

  if (isError || !data) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        Failed to load question.
      </Card>
    );
  }

  return (
    <Card
      key={data.questionId}
      className="p-8 space-y-6 transition-all duration-300 animate-in fade-in zoom-in-95"
    >
       <Badge
          className={`px-3 py-1 text-xs font-medium ${
            data.difficulty >= 7
              ? "bg-red-500 text-white"
              : data.difficulty >= 4
              ? "bg-yellow-500 text-black"
              : "bg-green-500 text-white"
          }`}
        >
          Difficulty {data.difficulty}
        </Badge>
      <h2 className="text-xl font-semibold">{data.prompt}</h2>

      <div className="grid grid-cols-2 gap-4">
        {data.choices?.map((choice: string) => (
          <Button
            key={choice}
            variant={selected === choice ? "default" : "outline"}
            onClick={() => setSelected(choice)}
            className="transition-all hover:scale-105 hover:shadow-lg"
          >
            {choice}
          </Button>
        ))}
      </div>

      <Button
        disabled={!selected}
        onClick={submitAnswer}
        className="w-full transition-all hover:scale-[1.02]"
      >
        Submit Answer
      </Button>
    </Card>
  );
}
