import express from "express";
import Joi from "joi";
import {
  addNewUser,
  loginUser,
  listUsers,
  getUser,
  patchAvatar,
} from "../../models/users.js";
import jwt from "jsonwebtoken";
import env from "dotenv";
import {
  badRequest,
  created,
  success,
  unauthorized,
  conflict,
} from "../../schema/responseCases.js";
import { auth } from "../../config/config-passport.js";
import { uploadAvatar } from "../../config/config-multer.js";

env.config();

export const usersRouter = express.Router();

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

usersRouter.get("/current", async (req, res, next) => {
  const { id } = req.body;

  try {
    const user = await getUser(id);

    if (!user) {
      return res.status(404).json(`Error! User not found!`);
    }

    const { email } = user;
    return res.status(200).json(success(email));
  } catch (err) {
    res.status(500).json(`An error occurred while getting the contact: ${err}`);
  }
});

usersRouter.post("/signup", async (req, res, next) => {
  if (Object.keys(req.body).length < 2) {
    return res.status(400).json(badRequest());
  }
  const { email, password } = req.body;
  const allUsers = await listUsers();
  const userExist = allUsers.find((user) => user.email === email);

  if (userExist) {
    return res.status(409).json(conflict());
  }

  const validation = schema.validate({ email, password });

  if (validation.error) {
    return res
      .status(400)
      .json({ message: `Key ${validation.error.details[0].message}` });
  }

  const newUser = addNewUser(req.body);

  res.status(201).json(created(await newUser));
});

usersRouter.post("/login", async (req, res, next) => {
  if (Object.keys(req.body).length < 2) {
    return res.status(400).json(badRequest());
  }

  const user = await loginUser(req.body);

  const secret = process.env.SECRET;

  const payload = {
    id: user.id,
    email: user.email,
  };
  if (user) {
    const token = jwt.sign(payload, secret, { expiresIn: "1h" });

    user.token = token;
    await user.save();

    return res.status(200).json(success(user));
  } else {
    return res.status(401).json(unauthorized());
  }
});

usersRouter.post("/logout", auth, async (req, res, next) => {
  const { id } = req.body;
  const user = await getUser(id);

  if (!user) {
    return res.status(401).json(unauthorized("Unauthorized"));
  }
  user.token = null;
  await user.save();

  return res.status(204).json();
});

usersRouter.patch(
  "/avatars",
  auth,
  uploadAvatar.single("avatar"),
  async (req, res, next) => {
    const { id } = req.body;
    const { path } = req.file;

    const user = await getUser(id);

    const file = req.file;

    if (!file) {
      return res.status(401).json(unauthorized("File is missing!"));
    }
    if (!user) {
      return res.status(401).json(unauthorized("Unauthorized"));
    }
    try {
      const newAvatarPath = await patchAvatar(path, id);
      return res.status(200).json(success({ avatarURL: newAvatarPath }));
    } catch (err) {
      res
        .status(500)
        .json(`An error occurred while updating the avatar: ${err}`);
    }
  }
);