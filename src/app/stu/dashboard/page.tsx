import HistoryCard from "@/components/dashboard/HistoryCard";
import HotTopicsCard from "@/components/dashboard/HotTopicsCard";
import RecentActivityCard from "@/components/dashboard/RecentActivityCard";
import JoinTest from "@/components/dashboard/JoinTest";
import WordOfTheDay from "@/components/dashboard/WordOfTheDay";
import { getAuthSession } from "@/lib/nextauth";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
import UserInfoCard from "@/components/dashboard/UserInfo";

type Props = {};

export const metadata = {
  title: "Dashboard | TEST GEN EDU",
  description: "English is easy!",
};

// Hàm lấy thông tin người dùng từ Prisma dựa trên userId
const Dashboard = async (props: Props) => {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/");
  }

  if (session.user.role !== UserRole.STUDENT) {
    redirect("/not-authorized");
    return null;
  }

  // Lấy thông tin người dùng từ Prisma

  return (
    <main className="p-8 mx-auto max-w-7xl">
      <div className="grid gap-4 mt-4 md:grid-cols-2">
        <JoinTest />
        <HistoryCard />
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
        <UserInfoCard userId={session?.user.id} />
        <RecentActivityCard />
      </div>
    </main>
  );
};

export default Dashboard;
