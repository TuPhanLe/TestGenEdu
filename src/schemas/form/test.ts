import { z } from "zod";

const questionSchema = z.object({
  questionId: z.string(),
  question: z.string().optional(),
  answer: z.union([
    z.string(), // For other question types
    z.enum(["true", "false"]), // For true_false questions
  ]),
  options: z
    .array(
      z.string().min(1, { message: "Option must be at least 1 character long" })
    )
    .optional(),
});

const partSchema = z.object({
  partId: z.string(),
  paragraph: z.string().optional(),
  questions: z.array(questionSchema),
  type: z.enum(["mcq", "true_false", "matching", "fillup", "rewrite"]),
});

export const testSchema = z.object({
  testId: z.string(),
  folderId: z.string().optional(),
  topic: z
    .string()
    .min(4, { message: "Topic must be at least 4 characters long" })
    .max(50, { message: "Topic must be no more than 50 characters long" }),
  testDuration: z.coerce.number().int().positive(),
  attemptsAllowed: z.coerce.number().int().positive(),
  parts: z.array(partSchema),
});

// TypeScript types inferred from the Zod schema
export type TestSchemaType = z.infer<typeof testSchema>;
