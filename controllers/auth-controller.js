import User from "../models/user.js";
import bcrypt from "bcryptjs";
import HttpError from "../helpers/HttpError.js";
import ctrlDecorator from "../decorators/ctrl-decorator.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const signup = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });
  console.log(newUser);

  res.status(201).json({ user: { email: newUser.email, subscription: newUser.subscription } });
};

const signin = async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw HttpError(401, "email or password is invalid");

  const passwordCompare = await bcrypt.compare(password, user.password)
  if (!passwordCompare) throw HttpError(401, "email or error is invalid");

  const { JWT_SECRET } = process.env;

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, {token})  

  res.json({ token, user:{email: user.email, subscription: user.subscription} });
};

const getCurrent = (req, res) => {
  const {email, subscription} = req.user
  res.json({email, subscription})
};

const signout = async (req, res) => {
  const { _id: id } = req.user
  await User.findByIdAndUpdate(id, { token: "no" })
  
  res.status(204).send()
}

export default {
  signup: ctrlDecorator(signup),
  signin: ctrlDecorator(signin),
  getCurrent: ctrlDecorator(getCurrent),
  signout: ctrlDecorator(signout)
};

