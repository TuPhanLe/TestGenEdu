import { z } from "zod";

export const studentCollumsSchema = z.object({
  name: z.string(),
  userName: z.string(),
  email: z.string().optional(),
  status: z.string(),
  password: z.string(),
  class: z.string(),
  studentId: z.string().optional(),
  department: z.string().optional(),
});

export type Student = z.infer<typeof studentCollumsSchema>;
