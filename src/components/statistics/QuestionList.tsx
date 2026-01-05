import type { Question } from "generated/prisma";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { GAME_TYPE } from "@/types/question-response";

type Props = {
  gameType: GAME_TYPE;
  questions: Question[];
};

const QuestionList = ({ gameType, questions }: Props) => {
  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          <TableHead className="w-2.5">No.</TableHead>
          <TableHead>Question & Answer</TableHead>
          <TableHead>Your Answer</TableHead>
          {gameType === GAME_TYPE.OPEN_ENDED && (
            <TableHead className="w-2.5 text-right">Accuracy</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.map((question, index) => (
          <TableRow key={question.id}>
            <TableCell className="font-medium">{index}</TableCell>
            <TableCell>
              <div className="font-semibold">{question.question}</div>
              <div className="text-sm text-gray-500">
                Answer: {question.answer}
              </div>
            </TableCell>
            <TableCell>
              <span
                className={
                  question.isCorrectChoice || question.isCorrect
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {question.userAnswer}
              </span>
            </TableCell>
            {gameType === GAME_TYPE.OPEN_ENDED && (
              <TableCell className="text-right">
                {question.percentCorrect !== null &&
                question.percentCorrect !== undefined ? (
                  `${question.percentCorrect.toFixed(2)}%`
                ) : (
                  <span className="text-gray-400 italic">N/A</span>
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default QuestionList;
