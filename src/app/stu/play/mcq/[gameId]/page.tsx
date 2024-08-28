import MCQ from "@/components/MCQ";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { Test } from "@prisma/client";
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
  // console.log(gameId);

  const test = await prisma.test.findUnique({
    where: {
      id: gameId,
    },
    include: {
      paragraphs: {
        select: {
          id: true,
          content: true,
          questions: {
            select: {
              id: true,
              question: true,
              options: true,
            },
          },
        },
      },
    },
  });

  if (!test || test.testType !== "mcq") {
    return redirect("/quiz");
  }

  return <MCQ game={test} />;
};

export default MCQpage;
