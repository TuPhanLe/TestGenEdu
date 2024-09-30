import React from "react";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

type Props = {};

const create = async (props: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/");
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/not-authorized");
    return null;
  }
  return <div>create</div>;
};

export default create;
