import { Router } from "express";
import furnitureItemsController from "../controller/furnitureItemsController";
import { runInContext } from 'vm';

const router = Router();

router.route("/").get(furnitureItemsController.getAllFurniture);

router.route("/:id").get(furnitureItemsController.getFurnitureItemById);

export default router;
