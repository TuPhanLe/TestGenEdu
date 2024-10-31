import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { cn } from "@/lib/utils";

type TestResultProps = {
  testResults: {
    id: string;
    student: {
      name: string | null; // Cho phép giá trị null
      email: string | null; // Cho phép giá trị null
    };
    score: number;
    totalScore: number;
    passed: boolean;
    attemptNumber: number;
    submittedAt: Date;
  }[];
};

const PlayerList = ({ testResults }: TestResultProps) => {
  console.log(testResults);

  return (
    <div>
      <Table className="mt-4">
        <TableCaption>End of player list.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[10px]">No.</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Passed</TableHead>
            <TableHead>Attempt Number</TableHead>
            <TableHead>Submitted At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <>
            {testResults.map((result, index) => (
              <TableRow key={result.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{result.student.name}</TableCell>
                <TableCell className="font-semibold">
                  {result.score.toFixed(2)} / {result.totalScore.toFixed(2)}
                </TableCell>
                <TableCell
                  className={cn({
                    "text-green-600": result.passed,
                    "text-red-600": !result.passed,
                  })}
                >
                  {result.passed ? "Yes" : "No"}
                </TableCell>
                <TableCell>{result.attemptNumber}</TableCell>
                <TableCell>
                  {new Date(result.submittedAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </>
        </TableBody>
      </Table>
    </div>
  );
};

export default PlayerList;
