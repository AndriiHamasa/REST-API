import express from "express";
import userSchemas from "../../schemas/user-schemas.js";
import isValidatedbody from "../../decorators/validate-body.js";
import aythController from "../../controllers/auth-controller.js"
import {authenticate} from "../../middlewares/index.js";
import authController from "../../controllers/auth-controller.js";

export const authRouter = express.Router()

authRouter.post("/register", isValidatedbody(userSchemas.userSignupSchema), aythController.signup)

authRouter.post("/login", isValidatedbody(userSchemas.userSigninSchema), aythController.signin)

authRouter.get("/current", authenticate, authController.getCurrent)

authRouter.post("/logout", authenticate, authController.signout)