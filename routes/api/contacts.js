import express from "express";
import HttpError from "../../helpers/HttpError.js";
import { contactAddSchema } from "../../schemas/contact-schema.js";
import {
  getContlorer,
  getIdController,
  postController,
  deleteController,
  putController,
} from "../../controllers/contacts-controllers.js";

export const contactsRouter = express.Router();

contactsRouter.get("/", getContlorer);

contactsRouter.get("/:contactId", getIdController);

contactsRouter.delete("/:contactId", deleteController);

contactsRouter.use((req, _, next) => {
  const { error } = contactAddSchema.validate(req.body);
  if (error && req.method === "POST") {
    throw HttpError(400, error.message);
  }
  if (req.method === "PUT") {
    if (Object.entries(req.body).length === 0)
      throw HttpError(400, "missing fields");
    if (error) throw HttpError(400, error.message);
  }
  next();
});

contactsRouter.post("/", postController);

contactsRouter.put("/:contactId", putController);
