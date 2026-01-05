import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Award, Trophy } from "lucide-react";

type Props = {
  accuracy: number;
};

const ResultsCard = ({ accuracy }: Props) => {
  const getResultConfig = (accuracy: number) => {
    if (accuracy > 75) {
      return { color: "gold", message: "Impressive!" };
    } else if (accuracy > 25) {
      return { color: "silver", message: "Good Job!" };
    } else {
      return { color: "#B87333", message: "Nice try!" };
    }
  };

  const { color, message } = getResultConfig(accuracy);

  return (
    <Card className="md:col-span-7">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-2xl font-bold">Results</CardTitle>
        <Award />
      </CardHeader>
      <CardContent className="n-3/5 flex flex-col items-center justify-center">
        <Trophy className="mr-4" stroke={color} size={50} />
        <div className="h-2" />
        <div className="flex flex-col text-2xl font-semibold">
          <span className="text-center text-sm text-black opacity-50">
            {message} Your accuracy is {accuracy}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsCard;
