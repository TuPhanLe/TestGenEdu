"use client";
import React, { useEffect, useState, useMemo } from "react";
import moment from "moment-timezone"; // Import moment-timezone
import { Timer as TimerIcon } from "lucide-react";
import { formatTimeDelta, formatDate } from "@/lib/utils";
import { differenceInSeconds, addMinutes } from "date-fns";

type TimerProps = {
  startTime: Date;
  duration: number; // Thời lượng (phút)
  onEnd: () => void; // Callback khi hết giờ
};

const Timer: React.FC<TimerProps> = ({ startTime, duration, onEnd }) => {
  const [now, setNow] = React.useState(formatDate(new Date()));
  const [hasEnded, setHasEnded] = useState<boolean>(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(formatDate(new Date()));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [hasEnded]);

  return (
    <div className="flex items-center space-x-2">
      <TimerIcon className="mr-2" />
      <span>{formatTimeDelta(differenceInSeconds(now, startTime))}</span>
    </div>
  );
};

export default Timer;
