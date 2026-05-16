import { z } from "zod";

export const chatRequestSchema = z.object({
  document: z.string().min(1),
  question: z.string().min(1),
});
