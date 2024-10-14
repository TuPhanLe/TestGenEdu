import { z } from "zod";

export const lectureColumn = z.object({
  name: z.string(),
  userName: z.string(),
  email: z.string().optional(),
  status: z.string(),
});

export type Lecturer = z.infer<typeof lectureColumn>;
