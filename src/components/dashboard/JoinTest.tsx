"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Feather } from "lucide-react";

type Props = {};

const JoinTest = (props: Props) => {
  const router = useRouter();
  return (
    <Card
      className="hover:cursor-pointer hover:opacity-75"
      onClick={() => {
        // router.push("/stu/play/cm2dbio8k00002v6qj9ppojbt");
        router.push("/stu/selection");
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-bold">
          Let&apos;s Make a Test!
        </CardTitle>
        <Feather size={28} strokeWidth={2.5} />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Join your test.</p>
      </CardContent>
    </Card>
  );
};

export default JoinTest;
