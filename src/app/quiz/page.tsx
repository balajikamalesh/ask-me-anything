import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import QuizCreation from "@/components/QuizCreation";

type Props = {
  searchParams: Promise<{ topic?: string }>;
};

export const metadata = {
  title: "Quiz | Quiz Engine",
};

const QuizPage = async (props: Props) => {
  const userId = await auth();
  if (!userId) redirect("/sign-in");
  
  const searchParams = await props.searchParams;

  return <div className="h-screen">
    <QuizCreation topic={searchParams.topic} />
  </div>;
};

export default QuizPage;
