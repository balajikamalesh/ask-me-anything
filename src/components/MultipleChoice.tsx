"use client";

import axios from "axios";
import { toast } from "sonner";
import { differenceInSeconds } from "date-fns";
import { BarChart, ChevronRight, Timer } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Button, buttonVariants } from "./ui/button";
import MCQCounter from "./MCQCounter";
import { useMutation } from "@tanstack/react-query";
import { GAME_TYPE } from "@/types/question-response";
import type { Game, Question } from "generated/prisma";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { cn, formatTimeDelta } from "@/lib/utils";

type Props = {
  game: Game & { questions: Pick<Question, "id" | "question" | "options">[] };
  mode?: GAME_TYPE;
};

const MultipleChoice = ({ game, mode = GAME_TYPE.MULTIPLE_CHOICE }: Props) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [now, setNow] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      if(!hasEnded){
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
      const response = await axios.post("/api/checkAnswer", {
        questionId: currentQuestion?.id,
        userAnswer: (mode === GAME_TYPE.MULTIPLE_CHOICE 
            ? (options?.[selectedChoice as number])
            : (selectedChoice as boolean)),
        questionType: mode,
      });
      return response.data;
    },
  });

  const options = useMemo(() => {
    if(mode === GAME_TYPE.MULTIPLE_CHOICE) {
      if (!currentQuestion || !currentQuestion.options) return [];
      return JSON.parse(currentQuestion.options as string) as string[];
    }
  }, [currentQuestion]);

  useEffect(() => {
    if(mode == GAME_TYPE.MULTIPLE_CHOICE) {
      const handleKeydown = (e: KeyboardEvent) => {
        if (e.key >= "1" && e.key <= String(options?.length)) {
          setSelectedChoice(Number(e.key) - 1);
        }
        if (e.key === "Enter") {
          handleNext();
        }
      };
      document.addEventListener("keydown", handleKeydown);

      return () => {
        document.removeEventListener("keydown", handleKeydown);
      };
    }
  }, []);

  const handleNext = useCallback(() => {
    checkAnswer(undefined, {
      onSuccess: ({ isCorrect }) => {
        if (isCorrect) {
          setCorrectCount((count) => count + 1);
          toast.success("Correct answer!");
        } else {
          setIncorrectCount((count) => count + 1);
          toast.error("Incorrect answer.");
        }
        if (questionIndex === game.questions.length - 1) {
          setHasEnded(true);
          return;
        }
        setSelectedChoice(null);
        setQuestionIndex((index) => index + 1);
      },
    });
  }, [currentQuestion, options, selectedChoice]);

  if (hasEnded) {
    return (
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center">
        <div className="mt-2 rounded-md bg-green-500 px-4 font-semibold whitespace-nowrap text-white">
          You completed the quiz in {formatTimeDelta(
              differenceInSeconds(now, new Date(game.timeStarted)),
            )}!
        </div>
        <Link
          href={`/statistics/${game.id}`}
          className={cn(buttonVariants(), "mt-2")}
        >
          View Statistics
          <BarChart className="ml-2 h-4 w-4" />
        </Link>
      </div>
    );
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
        <MCQCounter
          correctCount={correctCount}
          incorrectCount={incorrectCount}
        />
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
        {mode === GAME_TYPE.MULTIPLE_CHOICE ? options?.map((option, idx) => {
          return (
            <Button
              key={idx}
              className="mb-4 w-full cursor-pointer justify-start py-8"
              onClick={() => setSelectedChoice(idx)}
              variant={selectedChoice === idx ? "default" : "secondary"}
            >
              <div className="flex items-center justify-start">
                <div className="mr-5 rounded-md border p-2 px-3">{idx + 1}</div>
                <div className="text-start">{option}</div>
              </div>
            </Button>
          );
        }): (
          <>
            <Button key="true" className="mb-4 w-full cursor-pointer justify-start py-8"
              onClick={() => setSelectedChoice(true)}
              variant={selectedChoice === true ? "default" : "secondary"}>
                TRUE
            </Button>
            <Button key="false" className="mb-4 w-full cursor-pointer justify-start py-8"
              onClick={() => setSelectedChoice(false)}
              variant={selectedChoice === false ? "default" : "secondary"}>
                FALSE
            </Button>
          </>
        )}
        <Button
          className="mt-2 cursor-pointer"
          onClick={handleNext}
          disabled={selectedChoice === null || isChecking}
        >
          Next <ChevronRight className="ml-2 h-5 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MultipleChoice;
