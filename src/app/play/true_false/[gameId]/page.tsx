import MultipleChoice from "@/components/MultipleChoice";
import { db } from "@/server/db";
import { GAME_TYPE } from "@/types/question-response";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    gameId: string;
  };
};

const MultipleChoicePage = async ({ params }: Props) => {
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
          options: true,
        },
      },
    },
  });

  if (!game || game.gametype !== GAME_TYPE.TRUE_FALSE) {
    redirect("/quiz");
  }

  return <MultipleChoice mode={GAME_TYPE.TRUE_FALSE} game={game} />
  
};

export default MultipleChoicePage;
