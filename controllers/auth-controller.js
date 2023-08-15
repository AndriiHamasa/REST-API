import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { HttpError, avatarHelper } from "../helpers/index.js";
import ctrlDecorator from "../decorators/ctrl-decorator.js";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import "dotenv/config";


const signup = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  let avatarURL = null;

  if (!req.file) {
    avatarURL = gravatar.url(email);
  } else {
    const { path: oldPath, filename } = req.file;
    avatarURL = await avatarHelper(oldPath, filename);
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
};

const signin = async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw HttpError(401, "email or password is invalid");

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw HttpError(401, "email or error is invalid");

  const { JWT_SECRET } = process.env;

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
};

const getCurrent = (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const signout = async (req, res) => {
  const { _id: id } = req.user;
  await User.findByIdAndUpdate(id, { token: "no" });

  res.status(204).send();
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;

  const avatarURL = await avatarHelper(oldPath, filename);

  await User.findByIdAndUpdate(_id, { avatarURL });
  res.status(200).json({
    avatarURL,
  });
};

export default {
  signup: ctrlDecorator(signup),
  signin: ctrlDecorator(signin),
  getCurrent: ctrlDecorator(getCurrent),
  signout: ctrlDecorator(signout),
  updateAvatar: ctrlDecorator(updateAvatar),
};
