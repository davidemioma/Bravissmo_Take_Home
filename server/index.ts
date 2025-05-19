import helmet from "helmet";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "./middleware/logger";
import userRoutes from "./routes/user.routes";

const app = express();

const port = process.env.PORT || 8080;

//Middleware
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.disable("x-powered-by");
app.use(logger);

// Routes
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", userRoutes);

// Run server
app.listen(port, () => {
  console.log(`App running on port:${port}`);
});
