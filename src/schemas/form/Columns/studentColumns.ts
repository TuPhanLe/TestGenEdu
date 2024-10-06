import { z } from "zod";

export const studentSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name must be at least 1 character long" }),
  userName: z
    .string()
    .min(1, { message: "User Name must be at least 1 character long" }),
  email: z.string().optional(),
  status: z.string(),
  studentId: z
    .string()
    .min(1, { message: "Student ID must be at least 1 character long" }),
  class: z.string(),
  department: z.string(),
});

export type Student = z.infer<typeof studentSchema>;
