import { Router } from "express";
import authController from "../controller/authController";
import { uploadUserPhoto } from "../utils/multerConfig";
import { processUserPhoto } from "../middlewares/processImage";

const router = Router();

router
  .route("/signup")
  .post(uploadUserPhoto, processUserPhoto, authController.signup);

// router.route("/me").get(userController.get)

export default router;
