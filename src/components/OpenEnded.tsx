"use client";

import axios from "axios";
import { toast } from "sonner";
import { differenceInSeconds } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import type { Game, Question } from "generated/prisma";
import { ChevronRight, Loader, Timer } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { formatTimeDelta } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import EndScreen from "./EndScreen";

type Props = {
  game: Game & { questions: Pick<Question, "id" | "question" | "answer">[] };
};

const OpenEnded = ({ game }: Props) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [now, setNow] = useState(new Date());
  const [userAnswer, setUserAnswer] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [hasEnded]);

  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const { mutate: checkAnswer, isPending: isChecking } = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/checkAnswerSimilarity", {
        questionId: currentQuestion?.id,
        answer: currentQuestion?.answer,
        userAnswer,
      });
      return response.data;
    },
  });

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleNext();
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  const handleNext = useCallback(() => {
    checkAnswer(undefined, {
      onSuccess: ({ percentageSimilarity }) => {
        setUserAnswer("");
        toast.success(`Your answer is ${percentageSimilarity}% correct.`);
        if (questionIndex === game.questions.length - 1) {
          setHasEnded(true);
          return;
        }
        setQuestionIndex((index) => index + 1);
      },
    });
  }, [currentQuestion, checkAnswer]);

  if (hasEnded) {
    return <EndScreen game={game} now={now} />;
  }

  return (
    <div className="absolute top-1/2 left-1/2 w-[90vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 md:w-[80vw]">
      <div className="flex flex-row items-center justify-between">
        <p>
          <span className="mr-2 text-slate-400">Topic:</span>{" "}
          <span className="rounded-2xl bg-slate-800 px-2 py-1 text-white">
            {game.topic}
          </span>
        </p>
        <div className="mt-3 flex self-start text-slate-400">
          <Timer className="mr-2" />
          <span>
            {formatTimeDelta(
              differenceInSeconds(now, new Date(game.timeStarted)),
            )}
          </span>
        </div>
      </div>
      <Card className="mt-4 w-full">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 divide-y divide-zinc-600/50 text-center">
            <div>{questionIndex + 1}</div>
            <div className="text-base text-slate-400">
              {game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className="grow text-lg">
            <span
              dangerouslySetInnerHTML={{
                __html:
                  currentQuestion?.question.replace(
                    /\^(\d+)/g,
                    "<sup>$1</sup>",
                  ) || "",
              }}
            />
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="mt-4 flex w-full flex-col items-center justify-center">
        <Textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="text-sm text-gray-500 shadow-sm md:text-lg"
          placeholder="Max 15 words"
        />
        <Button
          className="mt-2 cursor-pointer"
          onClick={handleNext}
          disabled={isChecking}
        >
          {isChecking && <Loader className="mr-2 h-4 w-4 animate-spin" />}
          Next <ChevronRight className="ml-2 h-5 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default OpenEnded;
