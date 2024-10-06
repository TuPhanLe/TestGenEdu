import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const allSchema = z.object({
  name: z.string(),
  userName: z.string(),
  role: z.string(),
  dateJoined: z.string(),
  email: z.string().optional(),
  status: z.string(),
  studentId: z.string(),
  department: z.string(),
});

export type All = z.infer<typeof allSchema>;
