import { Router } from "express";
import { registerUser, loginUser, translate, logout, supportedLang } from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/translate").post(translate)
router.route("/logout").post(logout)
router.route("/suportedlang").get(supportedLang)

export default router;