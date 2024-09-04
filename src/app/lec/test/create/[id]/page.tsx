import React from "react";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import CreateTest from "@/components/forms/CreateTest";
export const metadata = {
  title: "TEST GEN EDU | DNU",
  description: "Let's make a Quiz!",
};

interface Props {
  searchParams: {
    id: string;
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

  return <CreateTest />;
};

export default Quiz;
