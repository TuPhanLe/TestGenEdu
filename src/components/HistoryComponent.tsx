import { prisma } from "@/lib/db";
import { Clock, CopyCheck } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  limit: number;
  userId: string;
};

const HistoryComponent = async ({ limit, userId }: Props) => {
  // Fetch the testAccess records for the user, limited by the provided limit
  const testAccesses = await prisma.testAccess.findMany({
    where: {
      userId: userId,
    },
    select: {
      test: {
        select: {
          id: true,
          topic: true,
          timeEnded: true,
        },
      },
    },
    take: limit,
  });

  return (
    <div className="space-y-8">
      {testAccesses.map(({ test }) => {
        return (
          <div className="flex items-center justify-between" key={test.id}>
            <div className="flex items-center">
              <CopyCheck className="mr-3" />
              <div className="ml-4 space-y-1">
                <Link
                  className="text-base font-medium leading-none underline"
                  href={`/statistics/${test.id}`}
                >
                  {test.topic}
                </Link>
                <p className="flex items-center px-2 py-1 text-xs text-white rounded-lg w-fit bg-slate-800">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(test.timeEnded ?? 0).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground"></p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HistoryComponent;
