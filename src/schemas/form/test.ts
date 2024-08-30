import { z } from "zod";

const questionSchema = z.object({
  questionId: z.string(),
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

const paragraphSchema = z.object({
  paragraphId: z.string(),
  paragraph: z
    .string()
    .min(4, { message: "Paragraph must be at least 4 charaters long" }),
  questions: z.array(questionSchema),
});

// Define the main schema

export const checkAnswerSchema = z.object({
  questionId: z.string(),
  userInput: z.string(),
});

export const testSchema = z.object({
  testId: z.string(),
  topic: z
    .string()
    .min(4, { message: "Topic must be at least 4 characters long" })
    .max(50, { message: "Topic must be no more than 50 characters long" }),
  type: z.enum([
    "mcq",
    "open_ended",
    "true_false",
    "matching",
    "fillup",
    "rewrite",
  ]),

  paragraphs: z.array(paragraphSchema),
});
