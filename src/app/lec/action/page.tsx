import React from "react";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Behavior from "@/components/action/Behavior";

export const metadata = {
  title: "TEST GEN EDU | DNU",
  description: "Let's make a Quiz!",
};

interface Props {
  searchParams: {
    topic?: string;
  };
}

const action = async ({ searchParams }: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/");
  }

  return <Behavior />;
};

export default action;
