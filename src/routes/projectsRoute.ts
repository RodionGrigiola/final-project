import { Router } from "express";
import projectsController from "../controller/projectsController"
import authController from "../controller/authController";

const router = Router();

router.route("/save").post(authController.protect, projectsController.saveProject)

router.route("/:id").get(authController.protect, projectsController.getProjectById);

router.route("/").get(authController.protect, projectsController.getProjectsByUser)

export default router;