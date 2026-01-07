import React from "react";
import { db } from "@/server/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { auth, currentUser } from "@clerk/nextjs/server";
import { LucideLayoutDashboard } from "lucide-react";
import ResultsCard from "@/components/statistics/ResultsCard";
import TimeTakenCard from "@/components/statistics/TimeTakenCard";
import { GAME_TYPE } from "@/types/question-response";
import QuestionList from "@/components/statistics/QuestionList";

type Props = {
  params: {
    gameId: string;
  };
};

const StatisticsPage = async ({ params }: Props) => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const userInfo = await currentUser();
  const { gameId } = await params;

  const game = await db.game.findUnique({
    where: { id: gameId },
    include: { questions: true },
  });

  if (!game || game.userEmail !== userInfo?.emailAddresses[0]?.emailAddress) {
    redirect("/sign-in");
  }

  let accuracy: number = 0;
  const questions = game.questions;

  if (game.gametype === GAME_TYPE.MULTIPLE_CHOICE) {
    let correctAnswers = questions.filter(
      (question) => question.isCorrectChoice,
    );
    accuracy = (correctAnswers.length / questions.length) * 100;
  } else if (game.gametype === GAME_TYPE.TRUE_FALSE) {
    let correctAnswers = questions.filter((question) => question.isCorrect);
    accuracy = (correctAnswers.length / questions.length) * 100;
  } else {
    accuracy =
      questions.reduce((acc, curr) => acc + (curr.percentCorrect ?? 0), 0) /
      questions.length;
  }

  accuracy = Math.round(accuracy * 100) / 100;

  return (
    <>
      <div className="mx-auto max-w-7xl p-8">
        <div className="h-12"></div>
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Statistics</h2>
          <div className="flex items-center space-x-2">
            <Link href="/dashboard" className={buttonVariants()}>
              <LucideLayoutDashboard className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
        <div className="md-grid-cols-7 mt-4 grid gap-4">
          <ResultsCard accuracy={accuracy} />
          <TimeTakenCard
            timeEnded={new Date()}
            timeStarted={game.timeStarted}
          />
        </div>
        <QuestionList gameType={game.gametype as GAME_TYPE} questions={questions} />
      </div>
    </>
  );
};

export default StatisticsPage;
