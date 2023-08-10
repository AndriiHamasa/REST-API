import Contact from "../models/contact.js";
import HttpError from "../helpers/HttpError.js";
import ctrlDecorator from "../decorators/ctrl-decorator.js";

const getContlorer = async (req, res) => {
  const { _id: owner } = req.user
  console.log('req.query ==>> ', req.query)
  const { page, limit } = req.query
  const skip = (page - 1) * limit
  const result = await Contact.find({owner}, "-createdAt -updatedAt", {skip, limit}).populate("owner", "name email");
  res.json(result);
};

const getIdController = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const postController = async (req, res) => {
  const {_id: owner} = req.user
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const deleteController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);
  if (!result) {
    throw HttpError(404);
  }
  res.json({ message: "contact deleted" });
};

const putController = async (req, res) => {
  const { contactId } = req.params;

  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

const updateStatusContact  = async (req, res) => {
  const { contactId } = req.params;

  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true
  });
  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

export default {
  getContlorer: ctrlDecorator(getContlorer),
  getIdController: ctrlDecorator(getIdController),
  postController: ctrlDecorator(postController),
  deleteController: ctrlDecorator(deleteController),
  putController: ctrlDecorator(putController),
  updateStatusContact : ctrlDecorator(updateStatusContact ),
};
