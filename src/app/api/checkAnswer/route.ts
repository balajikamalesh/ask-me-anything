import { db } from "@/server/db";
import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { checkAnswerSchema } from "@/schema/form/quiz";

export async function POST(req: Request) {
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
            const isCorrectChoice = question.answer.toLocaleLowerCase().trim() === userAnswer.toString().toLocaleLowerCase().trim();
            await db.question.update({
                where: {
                    id: questionId,
                },
                data: {
                    userAnswer: userAnswer.toString(),
                    isCorrectChoice
                },
            });
            return NextResponse.json({ isCorrect: isCorrectChoice });
        } else if (questionType == "true_false") {
            const isCorrect = question.answer.toString() === userAnswer.toString();
            await db.question.update({
                where: {
                    id: questionId,
                },
                data: {
                    userAnswer: userAnswer.toString(),
                    isCorrect
                },
            });
            return NextResponse.json({ isCorrect });
        }
        return NextResponse.json({ error: "Unsupported question type" }, { status: 400 });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ errors: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
