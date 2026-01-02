import { Separator } from "@radix-ui/react-select";
import { CheckCircle2, XCircle } from "lucide-react";
import React from "react";

type Props = {
  correctCount?: number;
  incorrectCount?: number;
};

const MCQCounter = ({ correctCount = 0, incorrectCount = 0 }: Props) => {
  return (
    <div className="flex flex-row items-center justify-center rounded-lg border p-2 shadow-sm">
      <CheckCircle2 className="green" size={30} />
      <span className="mx-2 text-2xl text-[green]">{correctCount}</span>
      <Separator aria-orientation="vertical" />
      <span className="mx-3 text-2xl text-[red]">{incorrectCount}</span>
      <XCircle color="red" size="30" />
    </div>
  );
};

export default MCQCounter;
