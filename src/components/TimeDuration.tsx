"use client";

import React, { useEffect, useState } from "react";

interface CountdownProps {
  timeDuration: number; // Thời lượng đếm ngược tính bằng giây
}

const Countdown: React.FC<CountdownProps> = ({ timeDuration }) => {
  const [timeLeft, setTimeLeft] = useState<number>(timeDuration);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup interval khi unmount
  }, [timeLeft]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div>
      <h1>Countdown: {formatTime(timeLeft)}</h1>
    </div>
  );
};

export default Countdown;
