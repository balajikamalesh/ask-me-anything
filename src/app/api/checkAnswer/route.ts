import { checkAnswerSchema } from "@/schema/form/quiz";
import { db } from "@/server/db";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { questionId, userAnswer, questionType } = checkAnswerSchema.parse(body);

    const question = await db.question.findUnique({
        where: {
            id: questionId,
        },
    })
    if (!question) {
        return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    if (questionType == "multiple_choice") {
        const isCorrect = question.answer.toLocaleLowerCase().trim() === userAnswer.toLocaleLowerCase().trim();
        await db.question.update({
            where: {
                id: questionId,
            },
            data: {
                userAnswer,
                isCorrect
            },
        });
        return NextResponse.json({ isCorrect });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    }
  }
}
