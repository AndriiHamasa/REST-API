import {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} from "../models/contacts.js";
import HttpError from "../helpers/HttpError.js";

export const getContlorer = async (req, res, next) => {
  try {
    const result = await listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getIdController = async (req, res, next) => {
  try {
    const result = await getContactById(req.params.contactId);
    if (!result) {
      throw HttpError(404);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const postController = async (req, res, next) => {
  try {
    const result = await addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteController = async (req, res, next) => {
  try {
    const result = await removeContact(req.params.contactId);
    if (!result) {
      throw HttpError(404);
    }
    console.log("result with DELETING - ", result);
    res.json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
};

export const putController = async (req, res, next) => {
  try {
    const result = await updateContact(req.params.contactId, req.body);
    if (!result) {
      throw HttpError(404);
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};
