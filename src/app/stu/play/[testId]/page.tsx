import MCQ from "@/components/MCQ";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    testId: string;
  };
};

const MCQpage = async ({ params: { testId } }: Props) => {
  const session = await getAuthSession();
  if (!session) {
    redirect("/");
  }
  console.log(testId);

  const test = await prisma.test.findUnique({
    where: {
      id: testId,
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
  console.log(test);

  if (!test || test.testType !== "mcq") {
    return redirect("/quiz");
  }

  // Check if the TestAccess already exists for the user
  const existingAccess = await prisma.testAccess.findUnique({
    where: {
      testId_userId: {
        testId: test.id,
        userId: session.user.id,
      },
    },
  });

  if (!existingAccess) {
    // If it doesn't exist, create a new TestAccess record
    await prisma.testAccess.create({
      data: {
        testId: test.id,
        userId: session.user.id,
        accessLevel: "play", // You can adjust this based on your access level logic
      },
    });
  }

  return <MCQ game={test} />;
};

export default MCQpage;
