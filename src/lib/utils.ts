import type { GAME_TYPE } from "@/types/question-response";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeDelta(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds - hours * 3600) / 60);
  const secs = Math.floor(seconds - hours * 3600 - mins * 60);

  if (hours === 0 && mins === 0) {
    return `${secs}s`;
  }
  if (hours === 0) {
    return `${mins}m ${secs}s`;
  }
  return `${hours}h ${mins}m ${secs}s`;
}

export function getParamsForGPT(type: GAME_TYPE, count: number, topic: string) {
    const generationMap = {
      multiple_choice: {
        systemPrompt:
          "You are a helpful AI that is able to generate mcq questions and answers, the length of each answer should not be more than 15 words, store all answers and questions and options in a JSON array",
        userPrompts: new Array(count).fill(
          `You are to generate a random hard mcq question about ${topic}`,
        ),
        schema: {
          question: "question",
          answer:
            "answer with max length of 15 words, must match exactly one of the options",
          option1: "option1 with max length of 15 words",
          option2: "option2 with max length of 15 words",
          option3: "option3 with max length of 15 words",
        },
      },
      true_false: {
        systemPrompt:
          "You are a helpful AI that is able to generate true/false questions and answers, store all answers and questions in a JSON array",
        userPrompts: new Array(count).fill(
          `You are to generate a random hard true/false question about ${topic}`,
        ),
        schema: {
          question: "question",
          answer: "true or false",
        },
      },
      open_ended: {
        systemPrompt:
          "You are a helpful AI that is able to generate a pair of question and answers, the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array",
        userPrompts: new Array(count).fill(
          `You are to generate a random hard open-ended questions about ${topic}`,
        ),
        schema: {
          question: "question",
          answer: "answer with max length of 15 words",
        },
      },
    } as const;

    return generationMap[type];
  }