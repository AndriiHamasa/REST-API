import express from "express";
import userSchemas from "../../schemas/user-schemas.js";
import isValidatedbody from "../../decorators/validate-body.js";
import aythController from "../../controllers/auth-controller.js"
import {authenticate, upload} from "../../middlewares/index.js";
import authController from "../../controllers/auth-controller.js";

export const authRouter = express.Router()

authRouter.post("/register", isValidatedbody(userSchemas.userSignupSchema), upload.single("avatar"), aythController.signup)

authRouter.get("/verify/:verificationToken", authController.verify)

authRouter.post("/verify", isValidatedbody(userSchemas.userVerifySchema), authController.reverify)

authRouter.post("/login", isValidatedbody(userSchemas.userSigninSchema), aythController.signin)

authRouter.get("/current", authenticate, authController.getCurrent)

authRouter.post("/logout", authenticate, authController.signout)

authRouter.patch("/avatars", authenticate, upload.single("avatar"), authController.updateAvatar)