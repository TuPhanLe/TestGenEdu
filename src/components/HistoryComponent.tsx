import { prisma } from "@/lib/db";
import { Clock, CopyCheck } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  limit: number;
  userId: string;
};

const HistoryComponent = async ({ limit, userId }: Props) => {
  // Fetch the testResult records for the user, including attemptNumber and sorted by endTime in descending order
  const testResults = await prisma.testResult.findMany({
    where: {
      studentId: userId,
    },
    select: {
      test: {
        select: {
          id: true,
          topic: true,
        },
      },
      endTime: true, // Fetch the end time of the test
      attemptNumber: true, // Fetch the attempt number
    },
    orderBy: {
      endTime: "desc", // Sort by endTime in descending order (most recent first)
    },
    take: limit, // Limit the number of results
  });

  return (
    <div className="space-y-8">
      {testResults.map(({ test, endTime, attemptNumber }) =>
        test ? (
          <div className="flex items-center justify-between" key={test.id}>
            <div className="flex items-center">
              <CopyCheck className="mr-3" />
              <div className="ml-4 space-y-1">
                <Link
                  className="text-base font-medium leading-none underline"
                  href={`/stu/statistics/${test.id}/${attemptNumber}`}
                >
                  {test.topic} - Attempt {attemptNumber}
                </Link>
                <p className="flex items-center px-2 py-1 text-xs text-white rounded-lg w-fit bg-slate-800">
                  <Clock className="w-4 h-4 mr-1" />
                  {/* Format the endTime to include date, hour, and minute */}
                  {new Date(endTime ?? 0).toLocaleDateString()} -{" "}
                  {new Date(endTime ?? 0).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p key={Math.random()}>Test data not available</p>
        )
      )}
    </div>
  );
};

export default HistoryComponent;
