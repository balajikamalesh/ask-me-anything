"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BrainCircuit } from "lucide-react";
import { useRouter } from "next/navigation";

const QuizMeCard = () => {
  const router = useRouter();

  return (
    <Card
      className="opacity-100 hover:cursor-pointer hover:opacity-85 transition delay-100 hover:border-zinc-300"
      onClick={() => router.push("/quiz")}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Quiz Me</CardTitle>
        <BrainCircuit />
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Challenge yourself with a quiz!
        </p>
      </CardContent>
    </Card>
  );
};

export default QuizMeCard;
