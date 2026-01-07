import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs/server";
import { Binary, CircleQuestionMark, Clock, CopyCheck, Loader } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  limit: number;
};

const TYPE_LABEL = {
  multiple_choice: "Multiple Choice",
  open_ended: "Open Ended",
  true_false: "True/False",
}

const History = async ({ limit }: Props) => {
  const icons = {
    multiple_choice: <CopyCheck />,
    true_false: <Binary />,
    open_ended: <CircleQuestionMark />,
  };

  const loggedInUser = await currentUser();

  const games = await db.game.findMany({
    where: {
      userEmail: loggedInUser?.emailAddresses[0]?.emailAddress,
    },
    take: limit,
    include: {
      questions: true,
    },
    orderBy: {
      timeStarted: "desc",
    },
  });

  return (
    <div className="flex min-h-screen flex-col gap-4">
      {games ? games.map((game) => (
        <div key={game.id} className="flex items-center justify-between">
          <div className="flex items-center">
            {icons[game.gametype]}
            <div className="ml-4 space-y-1">
              <Link
                href={`statistics/${game.id}`}
                className="text-base leading-none font-medium underline"
              >
                {game.topic}
              </Link>
              <p className="flex items-center px-2 py-1 text-sm text-white rounded-lg w-fit bg-slate-800">
                <Clock className="w-4 h-4 mr-1" />
                {new Date(game.timeStarted).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">
                {TYPE_LABEL[game.gametype]}
              </p>
            </div>
          </div>
        </div>
      )) : <Loader className="animate-spin"/>}
    </div>
  );
};

export default History;
