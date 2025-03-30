import { Request, Response } from "express";
import Item from "../model/itemModel";
import { ItemResponse } from "../types";
import { paginate } from "../utils/paginate";

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

export default { getAllFurniture, getFurnitureItemById };
