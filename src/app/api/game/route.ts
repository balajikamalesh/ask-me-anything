import axios from "axios";
import { ZodError } from "zod";
import { db } from "@/server/db";
import { NextResponse } from "next/server";
import { QuizCreationSchema } from "@/schema/form/quiz";
import { auth, currentUser } from "@clerk/nextjs/server";
import type {
  mcqQuestion,
  oeQuestion,
  tfQuestion,
} from "@/types/question-response";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const { data } = await axios.post(`http://localhost:3000/api/questions`, {
      count: count,
      topic: topic,
      type: type,
    });

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
    console.log(error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
