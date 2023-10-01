import express from "express";
import Joi from "joi";

import {
  addNewUser,
  loginUser,
  listUsers,
  getUser,
  patchAvatar,
  getVerificationToken,
  getUserByEmail,
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
import { sendVerificationEmail } from "../../config/config-nodemailer.js";

env.config();

export const usersRouter = express.Router();

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

usersRouter.get("/current", auth, async (req, res, next) => {
  const { id } = req.user;

  try {
    const user = await getUser(id);

    if (!user) {
      return res.status(404).json(`Error! User not found!`);
    }

    return res.status(200).json(success(user));
  } catch (err) {
    res.status(500).json(`An error occurred while getting the contact: ${err}`);
  }
});

usersRouter.get("/verify/:verificationToken", async (req, res, next) => {
  const { verificationToken } = req.params;

  try {
    await getVerificationToken(verificationToken);

    return res.status(200).json(success("Verification successful"));
  } catch (err) {
    res.status(500).json(`An error occurred while getting the contact: ${err}`);
  }
});

usersRouter.post("/verify", async (req, res, next) => {
  const { email } = req.body;

  const user = await getUserByEmail(email);
  console.log(user);
  const { verificationToken, verify } = user;

  const link = `http://localhost:3000/api/users/verify/${verificationToken}`;

  if (verify) {
    res.status(400).json(badRequest("Verification has already been passed"));
  }

  if (!email) {
    res.status(400).json(badRequest("Missing required field email"));
  }

  try {
    await sendVerificationEmail(email, "Email Verification\n", link);

    return res.status(200).json(success("Verification email sent"));
  } catch (err) {
    res.status(500).json(`An error occurred while getting the contact: ${err}`);
  }
});

usersRouter.post("/signup", async (req, res, next) => {
  if (Object.keys(req.body).length < 2) {
    return res
      .status(400)
      .json(badRequest("Email and password cannot be empty"));
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
    return res
      .status(400)
      .json(badRequest("Email and password cannot be empty"));
  }

  const user = await loginUser(req.body);

  if (!user.verify) {
    return res.status(401).json(unauthorized("Verify your email first"));
  }

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
    const { id } = req.user;
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
