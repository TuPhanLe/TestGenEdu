import MCQ from "@/components/MCQ";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    gameId: string;
  };
};

const MCQpage = async ({ params: { gameId } }: Props) => {
  const session = await getAuthSession();
  if (!session) {
    redirect("/");
  }
  const game = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      question: {
        select: {
          id: true,
          question: true,
          options: true,
        },
      },
    },
  });
  if (!game || game.gameType !== "mcq") {
    return redirect("/quiz");
  }
  return <MCQ game={game} />;
};

export default MCQpage;
