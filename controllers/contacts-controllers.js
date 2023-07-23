import {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} from "../models/contacts.js";
import Joi from "joi";
import HttpError from "../helpers/HttpError.js";

const contactAddSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  })

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
        throw HttpError(404, `Contact with id-${req.params.contactId} was not found`)
      }
      res.json(result);
    } catch (error) {
      next(error)
      
    }
}
  
export const postController = async (req, res, next) => {
    try {
      const { error } = contactAddSchema.validate(req.body)
      if (error) {
        throw HttpError(400, error.message)
      }
      const result = await addContact(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error)
    }
}
  
export const deleteController = async (req, res, next) => {
    try {
      const result = await removeContact(req.params.contactId);
      if (!result) {
        throw HttpError(404, `Contact with id-${req.params.contactId} was not found`)
      }
      res.json(result);
    } catch (error) {
      next(error)
    }
}
  
export const putController = async (req, res, next) => {
    try {
      const { error } = contactAddSchema.validate(req.body)
      if (error) {
        throw HttpError(400, error.message)
      }
      const result = await updateContact(req.params.contactId, req.body);
      if (!result) {
        throw HttpError(404, `Contact with id-${req.params.contactId} was not found`)
      }
  
      res.json(result);
    } catch (error) {
      next(error)
    }
  }