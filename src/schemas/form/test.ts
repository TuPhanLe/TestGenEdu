import { z } from "zod";
const questionSchema = z.object({
  questionId: z.string(),
  question: z
    .string()
    .min(1, { message: "Question must be at least 1 character long" }),
  answer: z.union([
    z.string().min(1, { message: "Answer must be at least 1 character long" }), // For other question types
    z.enum(["true", "false"]), // For true_false questions
  ]),
  options: z
    .array(
      z.string().min(1, { message: "Option must be at least 1 character long" })
    )
    .optional(), // Make options optional
});

const partSchema = z.object({
  partId: z.string(),
  part: z
    .string()
    .min(4, { message: "Part must be at least 4 characters long" }),
  questions: z.array(questionSchema),
  type: z.enum(["mcq", "true_false", "matching", "fillup", "rewrite"]),
});

// Define the main schema with testDuration
export const checkAnswerSchema = z.object({
  questionId: z.string(),
  userInput: z.string(),
});

export const testSchema = z.object({
  testId: z.string(),
  folderId: z.string().optional(),
  topic: z
    .string()
    .min(4, { message: "Topic must be at least 4 characters long" })
    .max(50, { message: "Topic must be no more than 50 characters long" }),
  testDuration: z.coerce.number().int().positive(), // Duration of the test in minutes
  attemptsAllowed: z.coerce.number().int().positive(),
  parts: z.array(partSchema),
});
