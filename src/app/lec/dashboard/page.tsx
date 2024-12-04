import HistoryCard from "@/components/dashboard/HistoryCard";
import HotTopicsCard from "@/components/dashboard/HotTopicsCard";
import LecHistoryCard from "@/components/dashboard/LecHistoryCard";
import RecentActivityCard from "@/components/dashboard/RecentActivityCard";
import TestCreateCard from "@/components/dashboard/TestCreateCard";
import { getAuthSession } from "@/lib/nextauth";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

export const metadata = {
  title: "Dashboard | TEST GEN EDU",
  description: "English is easy!",
};

const Dasboard = async (props: Props) => {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/");
  }

  if (session.user.role !== UserRole.LECTURER) {
    redirect("/not-authorized");
    return null;
  }

  return (
    <main className="min-h-screen p-8 mx-auto max-w-7xl">
      <div className="flex items-center">
        <h2 className="mr-2 text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 mt-4 md:grid-cols-2">
        <TestCreateCard />
        <LecHistoryCard />
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
        {/* <RecentActivityCard /> */}
      </div>
    </main>
  );
};

export default Dasboard;
