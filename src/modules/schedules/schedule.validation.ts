import { z } from "zod";

export const createClassScheduleSchema = z.object({
  trainerId: z.string().min(1, "Trainer ID is required"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid start time format",
  }),
});
