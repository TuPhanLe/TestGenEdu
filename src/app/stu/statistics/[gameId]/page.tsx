import AccuracyCard from "@/components/satistics/AccuracyCard";
import QuestionList from "@/components/satistics/QuestionList";
import ResultCard from "@/components/satistics/ResultCard";
import TimeTakenCard from "@/components/satistics/TimeTakenCard";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { LucideLayout, LucideLayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    gameId: string;
  };
};

const StatisticPage = async ({ params: { gameId } }: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  const game = await prisma.test.findUnique({
    where: { id: gameId },
    include: {
      questions: true,
    },
  });
  if (!game) {
    return redirect("/quiz");
  }

  let accuracy: number = 0;
  let totalCorrect = game.questions.reduce((acc, question) => {
    if (question.isCorrect) {
      return acc + 1;
    }
    return acc;
  }, 0);
  accuracy = (totalCorrect / game.questions.length) * 100;
  accuracy = Math.round(accuracy * 100) / 100;
  return (
    <>
      <div className="p-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Statistics</h2>
          <div className="flex items-center space-x-2">
            <Link href="/dashboard" className={buttonVariants()}>
              <LucideLayoutDashboard className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
        <div className="grid gap-4 mt-4 md:grid-cols-7">
          <ResultCard accuracy={accuracy} />
          <AccuracyCard accuracy={accuracy} />
          <TimeTakenCard
            timeEnded={new Date()}
            timeStarted={game.timeStarted}
          />
        </div>
        <QuestionList question={game.questions} />
      </div>
    </>
  );
};

export default StatisticPage;
