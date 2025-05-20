import cors from "cors";
import helmet from "helmet";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "./middleware/logger";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import { corsOptions } from "./utils/cors-options";

const app = express();

const port = process.env.PORT || 8080;

//Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.disable("x-powered-by");
app.use(logger);

// Routes
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", userRoutes);

app.use("/api/products", productRoutes);

// Run server
app.listen(port, () => {
  console.log(`App running on port:${port}`);
});
