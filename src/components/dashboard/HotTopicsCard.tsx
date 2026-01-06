"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import CustomWordCloud from "../CustomWordCloud";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader } from "lucide-react";

const HotTopicsCard = () => {
  const [list, setList] = useState<string[]>([]);

  const { mutate: getHotTopics, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/hotTopics");
      return response.data;
    },
    onSuccess: ({ topics }) => {
      localStorage.setItem("hotTopics", JSON.stringify(topics.topics || []));
      setList(topics.topics || []);
    },
  });

  useEffect(() => {
    if (!localStorage.getItem("hotTopics")) {
      getHotTopics();
    } else {
      setList(JSON.parse(localStorage.getItem("hotTopics") || "[]"));
    }
  }, [getHotTopics]);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          Hot Topics
        </CardTitle>
        <CardDescription>
          Click on a topic to start a quiz on it.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2 flex items-center justify-center">
        {isPending ? (
          <Loader className="animate-spin" />
        ) : (
          <CustomWordCloud words={list || []} />
        )}
      </CardContent>
    </Card>
  );
};

export default HotTopicsCard;
