"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { BrainCircuit } from "lucide-react";

type Props = {};

const TestCreateCard = (props: Props) => {
  const router = useRouter();
  return (
    <Card
      className="hover:cursor-pointer hover:opacity-75"
      onClick={() => {
        router.push("/lec/test/create");
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-bold">Let's Make a Test!</CardTitle>
        <BrainCircuit size={28} strokeWidth={2.5} />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Create truly great and beneficial tests.
        </p>
      </CardContent>
    </Card>
  );
};

export default TestCreateCard;
