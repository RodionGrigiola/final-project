import { Router } from "express";
import furnitureItemsController from "../controller/furnitureItemsController";

const router = Router();

router.route("/").get(furnitureItemsController.getAllFurniture);

router.route("/:id").get(furnitureItemsController.getFurnitureItemById);

router.route("/category/:categoryId").get(furnitureItemsController.getFurnitureItemsByCategory);


export default router;
