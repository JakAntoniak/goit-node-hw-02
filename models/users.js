import { User } from "../schema/usersSchema.js";
import bcrypt from "bcrypt";
import gravatar from "gravatar";
import Jimp from "jimp";
import fs from "fs/promises";
import crypto from "crypto";
import { sendVerificationEmail } from "../config/config-nodemailer.js";

export const listUsers = async () => {
  try {
    return await User.find();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getVerificationToken = async (verificationToken) => {
  try {
    const user = await User.findOne({ verificationToken });

    if (!user) {
      console.log("Error: User not found");
    }

    const { verify } = user;
    if (verify) {
      throw new Error("User has been verified");
    }
    user.verify = true;
    user.verificationToken = null;

    await user.save();
  } catch (err) {
    console.log("Error getting user: ", err);
    throw err;
  }
};

export const getUser = async (id) => {
  try {
    return User.findById(id);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getUserByEmail = async (email) => {
  try {
    return User.findOne({ email });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const addNewUser = async (body) => {
  const { email, password } = body;

  const url = gravatar.url(email, {
    s: "400",
    r: "x",
    d: "robohash",
  });

  const verificationToken = crypto.randomBytes(16).toString("hex");

  try {
    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {
      email,
      password: hashedPassword,
      avatarURL: url,
      verificationToken: verificationToken,
    };

    const link = `http://localhost:3000/api/users/verify/${newUser.verificationToken}`;

    await sendVerificationEmail(newUser.email, "Email Verification\n", link);

    return User.create(newUser);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const loginUser = async (body) => {
  const { email, password } = body;
  const allUsers = await listUsers();
  const user = allUsers.find((user) => user.email === email);

  if (!user) return false;

  try {
    const isUser = await bcrypt.compare(password, user.password);
    if (isUser) {
      return user;
    }
    return false;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const patchAvatar = async (avatarPath, userId) => {
  try {
    const localPath = `public/avatars/${userId}-avatar.jpg`;

    const avatar = await Jimp.read(avatarPath);
    await avatar.resize(250, 250).quality(60).writeAsync(localPath);

    await User.findByIdAndUpdate({ _id: userId }, { avatarURL: localPath });

    await fs.unlink(avatarPath);
    return localPath;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
