import React from "react";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import OpenEnded from "@/components/OpenEnded";
import { GAME_TYPE } from "@/types/question-response";

type Props = {
  params: {
    gameId: string;
  };
};

const OpenEndedPage = async ({ params }: Props) => {
  const { gameId } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // fetch game details with questions
  const game = await db.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      questions: {
        select: {
          id: true,
          question: true,
          answer: true,
        },
      },
    },
  });

  if (!game || game.gametype !== GAME_TYPE.OPEN_ENDED) {
    redirect("/quiz");
  }

  return <OpenEnded game={game} />
  
};

export default OpenEndedPage;
