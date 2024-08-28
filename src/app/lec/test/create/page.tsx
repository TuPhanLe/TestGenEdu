import React from "react";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import QuizCreation from "@/components/forms/QuizCreation";
import { UserRole } from "@prisma/client";
export const metadata = {
  title: "TEST GEN EDU | DNU",
  description: "Let's make a Quiz!",
};

interface Props {
  searchParams: {
    topic?: string;
  };
}

const Quiz = async ({ searchParams }: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/");
  }

  if (session.user.role !== UserRole.LECTURE) {
    redirect("/not-authorized");
    return null;
  }

  return <QuizCreation />;
};

export default Quiz;
