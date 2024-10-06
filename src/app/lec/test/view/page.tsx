import React from "react";
import { notFound, redirect } from "next/navigation";
import { getAuthSession } from "@/lib/nextauth";
import { UserRole } from "@prisma/client";
import ViewTest from "@/components/action/ViewTest";

export const metadata = {
  title: "TEST GEN EDU | DNU",
  description: "Let's make a Quiz!",
};

type Props = {
  params: {};
};

const View = async (params: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/");
  }

  if (session.user.role !== UserRole.LECTURER) {
    redirect("/not-authorized");
    return null;
  }

  return <ViewTest />;
};

export default View;
