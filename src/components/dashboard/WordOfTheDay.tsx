// components/WordOfTheDay.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type Word = {
  word: string;
  definition: string;
};

// Danh sách các từ tĩnh (có thể mở rộng hoặc dùng API thay thế)
const words: Word[] = [
  {
    word: "Serendipity",
    definition:
      "The occurrence of events by chance in a happy or beneficial way.",
  },
  { word: "Ephemeral", definition: "Lasting for a very short time." },
  {
    word: "Quintessential",
    definition: "Representing the most perfect example of a quality.",
  },
  {
    word: "Eloquence",
    definition: "Fluent or persuasive speaking or writing.",
  },
  {
    word: "Resilience",
    definition: "The capacity to recover quickly from difficulties.",
  },
];

const WordOfTheDay: React.FC = () => {
  const [wordOfTheDay, setWordOfTheDay] = useState<Word | null>(null);

  // Lấy từ ngẫu nhiên từ danh sách khi component được mount
  useEffect(() => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setWordOfTheDay(randomWord);
  }, []);

  if (!wordOfTheDay) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    );
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Word of the Day</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-lg font-semibold">{wordOfTheDay.word}</h2>
        <p className="text-sm text-muted-foreground mt-2">
          {wordOfTheDay.definition}
        </p>
      </CardContent>
    </Card>
  );
};

export default WordOfTheDay;
