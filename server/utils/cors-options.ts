import type { CorsOptions } from "cors";

type CorsCallback = (err: Error | null, allow?: boolean) => void;

const allowedOrigins: string[] = ["http://localhost:3000"];

export const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: CorsCallback) => {
    if (allowedOrigins.indexOf(origin as string) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS!"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
