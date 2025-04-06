import { Request, Response } from "express";
import Item from "../model/itemModel";
import { CategoryResponse, IItem, ItemCategory, ItemResponse } from "../types";
import { paginate } from "../utils/paginate";
import Category from '../model/categoryModel';

const getAllFurniture = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 5;
    const result = await paginate(Item, page, pageSize);
    res.status(200).json({
      result,
    });
  } catch (e) {
    res.status(400).json({ "Error: ": e });
  }
};

const getFurnitureItemById = async (req: Request, res: Response) => {
  try {
    const item: ItemResponse = await Item.findById(req.params.id);
    if (!item) {
      res.status(404).send({ error: "item not found" });
      return;
    }
    res.status(200).json({
      item,
    });
  } catch (e) {
    res.status(400).json({ "Error: ": e });
  }
};

const getFurnitureItemsByCategory = async (req: Request, res: Response) => {
  try {
    if (!req.params.categoryId) {
      res.status(400).json({ error: 'Category parameter is required' });
      return;
    }

    const response: CategoryResponse = await Category.findById(req.params.categoryId);
    if (!response?.category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    
    const items: IItem[] = await Item.find({ 
      'properties.category': response.category
    });
    
    res.status(200).json({
      items,
    });
  }
  catch (e) {
    res.status(500).json({ "Error: ": e });
  }
}

export default { getAllFurniture, getFurnitureItemById, getFurnitureItemsByCategory };
