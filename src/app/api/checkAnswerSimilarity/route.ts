import { db } from "@/server/db";
import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { strict_output } from "@/lib/gpt";

export async function POST(request: Request) {
      try {
        const { questionId, answer, userAnswer } = await request.json();

        let percentageSimilarity = await strict_output(
          "You are a helpful AI that is able to compare two text answers and return a similarity percentage as an integer between 0 and 100, where 100 means the answers are identical and 0 means they have no similarity.",
          [`Compare the User Answer with correct answer and return only the similarity percentage as an integer between 0 and 100.\nCorrect Answer: ${answer}\nUser Answer: ${userAnswer}`],
          {
            similarityPercentage: "similarity percentage as an integer between 0 and 100",
          },
        );

        console.log("Similarity Percentage:", percentageSimilarity);

        await db.question.update({
          where: {
            id: questionId,
          },
          data: {
            userAnswer,
            // percentCorrect field in db is double presision
            percentCorrect: parseFloat(percentageSimilarity[0].similarityPercentage),
          },
        });

        return NextResponse.json({ percentageSimilarity: parseFloat(percentageSimilarity[0].similarityPercentage) }, { status: 200 });

      } catch (error) {
        if (error instanceof ZodError) {
          return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
      }
}