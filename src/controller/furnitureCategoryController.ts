import { Request, Response } from "express";
import Category from "../model/categoryModel";
import { CategoryResponse } from "../types";
import { paginate } from "../utils/paginate";

const test = (req: Request, res: Response) => {
  res.send("Test route success");
};

const getFurnitureCategories = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    const result = await paginate(Category, page, pageSize);

    res.status(200).json({
      result,
    });
  } catch (e) {
    res.status(400).json({ "Error: ": e });
  }
};

const getFurnitureCategoryById = async (req: Request, res: Response) => {
  try {
    const category: CategoryResponse = await Category.findById(req.params.id);
    if (!category) {
      res.status(404).send({ error: "category not found" });
      return;
    }
    res.status(200).json({
      category,
    });
  } catch (e) {
    res.status(400).json({ "Error: ": e });
  }
};

export default { test, getFurnitureCategories, getFurnitureCategoryById };
