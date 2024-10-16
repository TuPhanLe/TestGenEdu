"use client";
import React, { useState, useCallback, useRef } from "react";
import { TestSchemaType } from "@/schemas/form/test";
import PartRenderer from "./PartRender";
import { Timer as TimerIcon, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import Timer from "./Timer";
type TestComponentProps = {
  test: TestSchemaType;
  timeStarted: Date;
  attemptNumber: number;
};

const TestComponent: React.FC<TestComponentProps> = ({
  test,
  timeStarted,
  attemptNumber,
}) => {
  const [partIndex, setPartIndex] = useState<number>(0);
  const [hasEnded, setHasEnded] = useState<boolean>(false);
  const hasFinishedRef = useRef<boolean>(false);
  const { toast } = useToast();

  const handleFinish = useCallback(() => {
    if (hasFinishedRef.current) return;

    toast({
      title: "Test Completed!",
      description: "Your test has been submitted.",
      variant: "success",
    });

    hasFinishedRef.current = true;
    setHasEnded(true);
  }, [toast]);

  const handleNextPart = useCallback(() => {
    if (partIndex < test.parts.length - 1) {
      setPartIndex((prev) => prev + 1);
    } else {
      handleFinish();
    }
  }, [partIndex, test.parts.length, handleFinish]);

  const handlePreviousPart = useCallback(() => {
    if (partIndex > 0) {
      setPartIndex((prev) => prev - 1);
    }
  }, [partIndex]);

  if (hasEnded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold">Test Completed!</h2>
        <p>
          You finished in <TimerIcon className="mr-2" />
        </p>
        <Link className="mt-4" href="/dashboard">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const currentPart = test.parts[partIndex];

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw]">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <p>
            <span className="text-slate-400 mr-2">Topic</span>
            <span className="px-2 py-1 text-white rounded-lg bg-slate-800">
              {test.topic}
            </span>
          </p>
          <Timer
            startTime={timeStarted}
            duration={test.testDuration}
            onEnd={handleFinish}
          />
        </div>
        <div>
          Part {partIndex + 1} of {test.parts.length}
        </div>
      </div>

      <PartRenderer part={currentPart} />

      <div className="flex justify-between mt-4">
        <Button
          variant="secondary"
          onClick={handlePreviousPart}
          disabled={partIndex === 0}
        >
          <ChevronLeft className="mr-2" /> Previous
        </Button>
        <Button
          variant="destructive"
          onClick={handleNextPart}
          disabled={partIndex === test.parts.length - 1}
        >
          {partIndex === test.parts.length - 1 ? "Finish Test" : "Next Part"}
          <ChevronRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default TestComponent;
