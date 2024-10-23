"use client";
import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
} from "react";
import axios from "axios"; // Import Axios
import { TestSchemaType } from "@/schemas/form/test";
import PartRenderer from "./PartRender";
import { Timer as TimerIcon, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogContent,
} from "@/components/ui/dialog";
import Link from "next/link";
import Timer from "./Timer";
import { formatTimeDelta } from "@/lib/utils";
import { addMinutes, differenceInSeconds } from "date-fns";

// Hàm trộn ngẫu nhiên mảng
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

type TestComponentProps = {
  test: TestSchemaType;
  timeStarted: Date;
  attemptNumber: number;
};

type ResultState = {
  questionId: string;
  userAnswer: string;
};

const TestComponent: React.FC<TestComponentProps> = ({
  test,
  timeStarted,
  attemptNumber,
}) => {
  const [shuffledParts, setShuffledParts] = useState(() =>
    shuffleArray(test.parts)
  );
  const [partIndex, setPartIndex] = useState<number>(0);
  const [hasEnded, setHasEnded] = useState<boolean>(false);
  const hasFinishedRef = useRef<boolean>(false);
  const [results, setResults] = useState<ResultState[]>([]);
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string | null>
  >({});

  const endTime = useMemo(
    () => addMinutes(timeStarted, test.testDuration),
    [timeStarted, test.testDuration]
  );

  const elapsedTime = useMemo(() => {
    if (!hasEnded) return 0;
    return differenceInSeconds(new Date(), timeStarted);
  }, [hasEnded, timeStarted]);

  const handleSaveAnswer = useCallback((result: ResultState) => {
    setResults((prevResults) => [
      ...prevResults.filter((r) => r.questionId !== result.questionId),
      result,
    ]);

    setSelectedOptions((prev) => ({
      ...prev,
      [result.questionId]: result.userAnswer,
    }));
  }, []);

  const submitTestResults = async (submissionData: any) => {
    try {
      const response = await axios.post("/api/result/finish", submissionData);
      console.log("Submission Response:", response.data);

      toast({
        title: "Test Submitted!",
        description: "Your answers have been saved.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error submitting test results:", error);

      toast({
        title: "Submission Failed",
        description: "There was an error submitting your answers.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitResults = useCallback(() => {
    const submissionData = {
      testId: test.testId, // Bổ sung testId
      results: results,
      startTime: timeStarted,
      endTime: new Date(), // Thời điểm submit
    };

    console.log("Submission Data:", submissionData);
    submitTestResults(submissionData); // Gửi dữ liệu xuống backend
  }, [results, timeStarted, test.testId]);

  const handleFinish = useCallback(() => {
    if (hasFinishedRef.current) return;

    handleSubmitResults();
    hasFinishedRef.current = true;
    setHasEnded(true);
  }, [handleSubmitResults]);

  const handleNextPart = useCallback(() => {
    if (partIndex < shuffledParts.length - 1) {
      setPartIndex((prev) => prev + 1);
    } else {
      setIsConfirmOpen(true);
    }
  }, [partIndex, shuffledParts.length]);

  const handlePreviousPart = useCallback(() => {
    if (partIndex > 0) {
      setPartIndex((prev) => prev - 1);
    }
  }, [partIndex]);

  // Lắng nghe sự kiện phím trái/phải để chuyển part
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        handleNextPart();
      } else if (event.key === "ArrowLeft") {
        handlePreviousPart();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNextPart, handlePreviousPart]);

  if (hasEnded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold">Test Completed!</h2>
        <p>
          You finished in <span>{formatTimeDelta(elapsedTime)}</span>
        </p>
        <Link className="mt-4" href="/stu/dashboard">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const currentPart = shuffledParts[partIndex];

  return (
    <div className="md:w-[80vw] max-w-8xl w-[90vw] mx-auto">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white z-10 shadow p-4 flex flex-row justify-between">
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
          Part {partIndex + 1} of {shuffledParts.length}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 border rounded-lg mt-4">
        <PartRenderer
          part={currentPart}
          onSaveAnswer={handleSaveAnswer}
          selectedOptions={selectedOptions}
        />
      </div>

      <div className="flex justify-between mt-4">
        <Button
          variant="secondary"
          onClick={handlePreviousPart}
          disabled={partIndex === 0}
        >
          <ChevronLeft className="mr-2" /> Previous
        </Button>
        <Button onClick={handleNextPart}>
          {partIndex === shuffledParts.length - 1 ? "Finish Test" : "Next Part"}
          <ChevronRight className="ml-2" />
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-xl font-semibold">Finish Test?</h2>
            <p>
              Are you sure you want to submit your answers and finish the test?
            </p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleFinish}>
              Confirm and Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestComponent;
