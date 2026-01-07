import { ZodError } from "zod";
import { db } from "@/server/db";
import { NextResponse } from "next/server";
import { QuizCreationSchema } from "@/schema/form/quiz";
import { currentUser } from "@clerk/nextjs/server";
import type {
  mcqQuestion,
  oeQuestion,
  tfQuestion,
} from "@/types/question-response";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { count, topic, type } = QuizCreationSchema.parse(body);
    const loggedInUser = await currentUser();

    const game = await db.game.create({
      data: {
        topic: topic,
        gametype: type,
        userEmail: loggedInUser?.emailAddresses[0]?.emailAddress ?? "",
        timeStarted: new Date(),
      },
    });

    const res = await fetch(`${process.env.API_URL}/questions`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count, topic, type }),
    });

    if (!res.ok) {
      throw new Error(`Questions API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (type === "multiple_choice") {
      let manyData = data.questions.map((question: mcqQuestion) => ({
        question: question.question,
        answer: question.answer,
        options: JSON.stringify(
          [
            question.option1,
            question.option2,
            question.option3,
          ].sort(() => Math.random() - 0.5),
        ),
        gameId: game.id,
      }));

      await db.question.createMany({
        data: manyData,
      });
    } else if (type === "open_ended") {
      let manyData = data.questions.map((question: oeQuestion) => ({
        question: question.question,
        answer: question.answer,
        gameId: game.id,
      }));

      await db.question.createMany({
        data: manyData,
      });
    } else {
      let manyData = data.questions.map((question: tfQuestion) => ({
        question: question.question,
        answer: question.answer.toString(),
        gameId: game.id,
      }));

      await db.question.createMany({
        data: manyData,
      });
    }

    return NextResponse.json({ gameId: game.id }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
