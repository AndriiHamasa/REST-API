import express from "express";
import { contactAddSchema, contactUpdateFavoriteSchema } from "../../schemas/contact-schema.js";
import {controlers} from "../../controllers/index.js"
import isValidatedbody from "../../decorators/validate-body.js";
import {authenticate, isEmptyBody, isValidId} from "../../middlewares/index.js";

export const contactsRouter = express.Router();

contactsRouter.use(authenticate)

contactsRouter.get("/", controlers.getContlorer);

contactsRouter.get("/:contactId", isValidId, controlers.getIdController);

contactsRouter.delete("/:contactId", isValidId, controlers.deleteController);

contactsRouter.post("/", isEmptyBody, isValidatedbody(contactAddSchema), controlers.postController);

contactsRouter.put("/:contactId", isValidId, isEmptyBody, isValidatedbody(contactAddSchema), controlers.putController);

contactsRouter.patch("/:contactId/favorite", isValidId, isEmptyBody, isValidatedbody(contactUpdateFavoriteSchema), controlers.updateStatusContact );