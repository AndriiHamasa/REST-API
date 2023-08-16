import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { HttpError, avatarHelper, sendEmail } from "../helpers/index.js";
import ctrlDecorator from "../decorators/ctrl-decorator.js";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import "dotenv/config";

const { JWT_SECRET, BASE_URL } = process.env;

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

  const verificationToken = nanoid();
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "Not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.json({ message: "Verification successful" });
};

const reverify = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw HttpError(401, "Not found");
  if (user.verify)
    res.status(400).json({ message: "Verification has already been passed" });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({ message: "Verification email sent" });
};

const signin = async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw HttpError(401, "email or password is invalid");
  if (!user.verify) HttpError(401, "Email not verified");

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw HttpError(401, "email or error is invalid");

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
  verify: ctrlDecorator(verify),
  reverify: ctrlDecorator(reverify),
  signin: ctrlDecorator(signin),
  getCurrent: ctrlDecorator(getCurrent),
  signout: ctrlDecorator(signout),
  updateAvatar: ctrlDecorator(updateAvatar),
};
