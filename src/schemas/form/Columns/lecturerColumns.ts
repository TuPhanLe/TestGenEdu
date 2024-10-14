import { z } from "zod";

export const lectureColumnsSchema = z.object({
  name: z.string(),
  userName: z.string(),
  password: z.string(),
  email: z.string().optional(),
  status: z.string(),
});

export type Lecturer = z.infer<typeof lectureColumnsSchema>;
