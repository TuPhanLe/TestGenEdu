import { getAuthSession } from "@/lib/nextauth";
import React from "react";

type Props = {};

export const metadata = {
  title: "Quiz | TEST GEN EDU",
};

const QuizPage = async (props: Props) => {
  const session = await getAuthSession();
  if (!session?.user) return <div>QuizPage</div>;
};

export default QuizPage;
