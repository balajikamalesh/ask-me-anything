import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Progress } from "./ui/progress";

type Props = {
  finished: boolean;
};

const loadingTexts = [
  "Generating questions...",
  "Unleashing the power of curiosity...",
  "Diving deep into the ocean of questions..",
  "Harnessing the collective knowledge of the cosmos...",
  "Igniting the flame of wonder and exploration...",
];

const LoadingQuestions = ({ finished }: Props) => {
  const [progress, setProgress] = useState(10);
  const [loadingText, setLoadingText] = useState(loadingTexts[0]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      let randomIndex = Math.floor(Math.random() * loadingTexts.length);
      setLoadingText(loadingTexts[randomIndex]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (finished) return 100;
        if (prev === 100) {
          return 0;
        }
        if (Math.random() < 0.1) {
          return prev + 2;
        }
        return prev + 0.5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [finished]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col justify-center gap-2">
        <Image
          className="border"
          src="/loading_1.gif"
          alt="Loading"
          width={500}
          height={500}
        />
        <Progress value={progress} className="mt-4 w-full" />
        <h1 className="mt-2 text-center text-xl">{loadingText}</h1>
      </div>
    </div>
  );
};

export default LoadingQuestions;
