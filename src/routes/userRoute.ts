import { Router } from "express";
import authController from "../controller/authController";
import { uploadUserPhoto } from "../utils/multerConfig";
import { processUserPhoto } from "../middlewares/processImage";

const router = Router();

router
  .route("/signup")
  .post(uploadUserPhoto, processUserPhoto, authController.signup);

router.route("/login").post(authController.login);

router.route("/test-protect").get(authController.protect, authController.test)
router.route("/logout").get(authController.logout)
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updatePassword', authController.protect, authController.updatePassword);



router.route("/me").get(authController.protect, authController.getMe)
router.route("/updateMe").patch(authController.protect, uploadUserPhoto, processUserPhoto, authController.updateMe)

export default router;
