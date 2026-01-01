import QuizCreation from "@/components/QuizCreation";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

export const metadata = {
  title: "Quiz | Quiz Engine",
};

const QuizPage = async (props: Props) => {
  const userId = await auth();
  if (!userId) redirect("/sign-in");

  return <div className="h-screen">
    <QuizCreation />
  </div>;
};

export default QuizPage;
