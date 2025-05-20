import { z } from "zod";

export const OnBoardSchema = z.object({
  clerkId: z.string().min(1, "Clerk ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  image: z.string().url("Invalid image URL").optional(),
});

export type FileType = {
  buffer: Buffer;
  fileName: string;
  contentType: string;
};
