import { Router } from "express";
import furnitureController from "../controller/furnitureCategoryController";

const router = Router();

router.route("/test").get(furnitureController.test);

router.route("/").get(furnitureController.getFurnitureCategories);

router.route("/:id").get(furnitureController.getFurnitureCategoryById);

export default router;
