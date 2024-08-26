import { z } from "zod";

export const folderSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Question must be at least 1 character long" }),
  description: z.string(),
  selectedTest: z.array(z.string()).optional(), // Add this line
});
