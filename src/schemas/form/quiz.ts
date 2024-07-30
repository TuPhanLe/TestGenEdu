import { z } from "zod";

const questionSchema = z.object({
  question: z
    .string()
    .min(1, { message: "Question must be at least 1 character long" }),
  answer: z
    .string()
    .min(1, { message: "Answer must be at least 1 character long" }),
  options: z.array(
    z.string().min(1, { message: "Option must be at least 1 character long" })
  ),
});

// Define the main schema
export const quizCreationSchema = z
  .object({
    topic: z
      .string()
      .min(4, { message: "Topic must be at least 4 characters long" })
      .max(50, { message: "Topic must be no more than 50 characters long" }),
    type: z.enum(["mcq", "open_ended"]),
    questions: z.array(questionSchema),
  })
  .refine(
    (data) => {
      if (data.type === "mcq") {
        return data.questions.every(
          (question) => question.options && question.options.length > 0
        );
      }
      return true;
    },
    {
      message: "Each question must have options if the type is 'mcq'",
      path: ["questions"],
    }
  );
export const checkAnswerSchema = z.object({
  questionId: z.string(),
  userInput: z.string(),
});
