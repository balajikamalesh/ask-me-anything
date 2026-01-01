import z from "zod";

export const QuizCreationSchema = z.object({
    topic: z.string().min(4, "Topic is required and should be at least 4 characters long").max(50),
    type: z.enum(["multiple_choice", "true_false", "open_ended"]),
    count: z.number().min(1).max(10)
});

export type QuizCreationType = z.infer<typeof QuizCreationSchema>;