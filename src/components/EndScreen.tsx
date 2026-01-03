import React from 'react'
import Link from 'next/link';
import type { Game } from "generated/prisma";
import { cn, formatTimeDelta } from '@/lib/utils';
import { differenceInSeconds } from 'date-fns';
import { BarChart } from 'lucide-react';
import { buttonVariants } from './ui/button';

type Props = {
    game: Game;
    now: Date;
}

const EndScreen = ({ game, now }: Props) => {
  return (
        <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center">
          <div className="mt-2 rounded-md bg-green-500 px-4 font-semibold whitespace-nowrap text-white">
            You completed the quiz in {formatTimeDelta(
                differenceInSeconds(now, new Date(game.timeStarted)),
              )}!
          </div>
          <Link
            href={`/statistics/${game.id}`}
            className={cn(buttonVariants(), "mt-2")}
          >
            View Statistics
            <BarChart className="ml-2 h-4 w-4" />
          </Link>
        </div>
      );
}

export default EndScreen