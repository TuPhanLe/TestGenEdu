"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { differenceInSeconds, addMinutes } from "date-fns";
import { Timer as TimerIcon } from "lucide-react";
import { formatTimeDelta } from "@/lib/utils";

type TimerProps = {
  startTime: Date;
  duration: number; // In minutes
  onEnd: () => void; // Callback when the timer ends
};

const Timer: React.FC<TimerProps> = ({ startTime, duration, onEnd }) => {
  const [now, setNow] = useState<Date>(new Date());
  const [hasEnded, setHasEnded] = useState<boolean>(false);

  const endTime = useMemo(() => {
    return addMinutes(startTime, duration); // Calculate the end time
  }, [startTime, duration]);

  const remainingTime = useMemo(() => {
    return Math.max(0, differenceInSeconds(endTime, now)); // Time left in seconds
  }, [endTime, now]);

  const elapsedTime = useMemo(() => {
    return differenceInSeconds(now, startTime); // Time passed since start in seconds
  }, [now, startTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date()); // Update the current time every second
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (remainingTime <= 0 && !hasEnded) {
      setHasEnded(true);
      onEnd(); // Trigger the onEnd callback
    }
  }, [remainingTime, hasEnded, onEnd]);

  return (
    <div className="flex items-center space-x-2">
      <TimerIcon className="mr-2" />
      <span>{formatTimeDelta(remainingTime)}</span>
    </div>
  );
};

export default Timer;
