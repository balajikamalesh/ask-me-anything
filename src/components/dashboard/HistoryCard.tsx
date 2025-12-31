"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { History } from "lucide-react";
import { useRouter } from "next/navigation";

const HistoryCard = () => {
  const router = useRouter();
  return (
    <Card
      className="hover:cursor-pointer hover:opacity-75"
      onClick={() => router.push("/history")}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">History</CardTitle>
        <History />
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">View your quiz history.</p>
      </CardContent>
    </Card>
  );
};

export default HistoryCard;
