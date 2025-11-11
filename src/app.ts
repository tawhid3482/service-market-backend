import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import { Application } from "express";
import cors from "cors";
import { router } from "./routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";

const app: Application = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("service-market start!");
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
