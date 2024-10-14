import React from "react";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import CreateTest from "@/components/forms/Test/CreateTest";
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

  if (session.user.role !== UserRole.LECTURER) {
    redirect("/not-authorized");
    return null;
  }

  return <CreateTest />;
};

export default Quiz;
