import express, { Request, Response } from "express";
import furnitureCategoryRouter from "./routes/furnitureCategoryRoute";
import furnitureItemsRouter from "./routes/furnitureItemsRoute";
import userRouter from "./routes/userRoute";
import path from 'node:path';
import cors from "cors";
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true 
}));

app.use('/models', express.static(path.join(__dirname, 'public/models')));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/furnitureCategory", furnitureCategoryRouter);
app.use("/furniture", furnitureItemsRouter);
app.use("/users", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("<h1>App is running</h1>");
});

app.get("*", (req: Request, res: Response) => {
  res.status(404).send("<h1>Page not found</h1>");
});

export default app;
