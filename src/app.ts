import express, { Request, Response } from "express";
import furnitureCategoryRouter from "./routes/furnitureCategoryRoute";
import furnitureItemsRouter from "./routes/furnitureItemsRoute";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/furnitureCategory", furnitureCategoryRouter);
app.use("/furniture", furnitureItemsRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("<h1>App is running</h1>");
});

app.get("*", (req: Request, res: Response) => {
  res.status(404).send("<h1>Page not found</h1>");
});

export default app;
