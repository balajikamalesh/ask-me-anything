import { strict_output } from "@/lib/gpt";
import { QuizCreationSchema } from "@/schema/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

// POST /api/questions
export async function POST(request: Request) {
  try {
    const reqBody = await request.json();
    const { type, count, topic } = QuizCreationSchema.parse(reqBody);

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

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
