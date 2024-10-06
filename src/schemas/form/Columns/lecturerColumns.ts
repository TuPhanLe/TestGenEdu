import { z } from "zod";

export const lectureSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name must be at least 1 character long" }),
  userName: z
    .string()
    .min(1, { message: "User Name must be at least 1 character long" }),
  email: z.string().optional(),
  status: z.string(),
});

export type Lecturer = z.infer<typeof lectureSchema>;
