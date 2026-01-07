import { strict_output } from "@/lib/gpt";
import { NextResponse } from "next/server";

// POST /api/hotTopics
export async function POST(request: Request) {
  try {
    let topics: string[] = []

    topics = await strict_output(
        "You are a helpful AI that is able to generate trending topics for quizzes without profanity or inappropriate content.",
        "You are to generate an array of 20 trending topics for quizzes in the current year",
        {
          topics: "array of 20 trending topics for quiz in the current year, with maximum two words for each topic",
        },
      );

    return NextResponse.json({ topics }, { status: 200 }); 
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
