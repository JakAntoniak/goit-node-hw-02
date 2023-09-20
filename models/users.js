import { User } from "../schema/usersSchema.js";
import bcrypt from "bcrypt";
import gravatar from "gravatar";

export const listUsers = async () => {
  try {
    return await User.find();
  } catch (err) {
    console.log(err);
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

export const addNewUser = async (body) => {
  const { email, password } = body;

  const url = gravatar.url(email, {
    s: "400",
    r: "x",
    d: "robohash",
  });

  console.log(url);
  try {
    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {
      email,
      password: hashedPassword,
      avatarURL: url,
    };

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
