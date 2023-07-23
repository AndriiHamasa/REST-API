import express from "express";
import { getContlorer, getIdController, postController, deleteController, putController } from "../../controllers/contacts-controllers.js";

export const contactsRouter = express.Router();

contactsRouter.get("/", getContlorer);

contactsRouter.get("/:contactId", getIdController);

contactsRouter.post("/", postController);

contactsRouter.delete("/:contactId", deleteController);

contactsRouter.put("/:contactId", putController);
