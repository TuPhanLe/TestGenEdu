import HistoryComponent from "@/components/HistoryComponent";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { LucideLayoutDashboard } from "lucide-react";

type Props = {};

const History = async (props: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  return (
    <div className="fixed -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-[1000px] ">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">History</CardTitle>
            <Link
              href="/stu/dashboard"
              className="px-4 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600"
            >
              <LucideLayoutDashboard className="inline-block mr-2" />
              <button>Back to Dashboard</button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="max-h-[60vh] overflow-scroll">
          <HistoryComponent limit={100} userId={session.user.id} />
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
