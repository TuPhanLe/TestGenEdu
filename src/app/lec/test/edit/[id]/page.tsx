import React from "react";
import { notFound, redirect } from "next/navigation";
import { getAuthSession } from "@/lib/nextauth";
import { prisma } from "@/lib/db";
import EditTest from "@/components/forms/EditTest";
import { UserRole } from "@prisma/client";

export const metadata = {
  title: "TEST GEN EDU | DNU",
  description: "Let's make a Quiz!",
};

type Props = {
  params: {
    id: string;
  };
};

const EditPage = async ({ params: { id } }: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/");
  }

  if (session.user.role !== UserRole.LECTURE) {
    redirect("/not-authorized");
    return null;
  }

  const test = await prisma.test.findUnique({
    where: {
      id: id,
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
              answer: true,
            },
          },
        },
      },
    },
  });

  if (!test || test.testType !== "mcq") {
    return redirect("/");
  }
  console.log(test);

  return <EditTest test={test} />;
};

export default EditPage;
