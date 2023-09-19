import { User } from "../schema/usersSchema.js";
import bcrypt from "bcrypt";

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
    const user = User.findById(id);
    return user;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const addNewUser = async (body) => {
  const { email, password } = body;

  try {
    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {
      email,
      password: hashedPassword,
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
