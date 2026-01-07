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
import { strict_output } from "@/lib/gpt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { count, topic, type } = QuizCreationSchema.parse(body);
    const loggedInUser = await currentUser();

    // Create a new game entry in the database
    const game = await db.game.create({
      data: {
        topic: topic,
        gametype: type,
        userEmail: loggedInUser?.emailAddresses[0]?.emailAddress ?? "",
        timeStarted: new Date(),
      },
    });

    // Generate questions using ai
    let questions: any[] = [];

    if (type === "multiple_choice") {
      questions = await strict_output(
        "You are a helpful AI that is able to generate mcq questions and answers, the length of each answer should not be more than 15 words, store all answers and questions and options in a JSON array",
        new Array(count).fill(
          `You are to generate a random hard mcq question about ${topic}`,
        ),
        {
          question: "question",
          answer: "answer with max length of 15 words, must match exactly one of the options",
          option1: "option1 with max length of 15 words",
          option2: "option2 with max length of 15 words",
          option3: "option3 with max length of 15 words",
        },
      );
    } else if (type === "true_false") {
      questions = await strict_output(
        "You are a helpful AI that is able to generate true/false questions and answers, store all answers and questions in a JSON array",
        new Array(count).fill(
          `You are to generate a random hard true/false question about ${topic}`,
        ),
        {
          question: "question",
          answer: "true or false",
        },
      );
    } else if (type === "open_ended") {
      questions = await strict_output(
        "You are a helpful AI that is able to generate a pair of question and answers, the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array",
        new Array(count).fill(
          `You are to generate a random hard open-ended questions about ${topic}`,
        ),
        {
          question: "question",
          answer: "answer with max length of 15 words",
        },
      );
    }

    if (type === "multiple_choice") {
      let manyData = questions.map((question: mcqQuestion) => ({
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
      let manyData = questions.map((question: oeQuestion) => ({
        question: question.question,
        answer: question.answer,
        gameId: game.id,
      }));

      await db.question.createMany({
        data: manyData,
      });
    } else {
      let manyData = questions.map((question: tfQuestion) => ({
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
