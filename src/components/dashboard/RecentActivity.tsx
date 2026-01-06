import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import History from "../History";
import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs/server";

type Props = {};

const RecentActivity = async (props: Props) => {
  const loggedInUser = await currentUser();

  const gamesCount = await db.game.count({
    where: {
      userEmail: loggedInUser?.emailAddresses[0]?.emailAddress,
    },
  });

  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex text-2xl font-bold">
          Recent Activities
        </CardTitle>
        <CardDescription>
          You have played a total of {gamesCount} games
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-145 overflow-scroll">
        <History limit={10} />
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
