import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userCreateSchema } from "../validator/index.js";

const prisma = new PrismaClient();

export const Register = async (req, res) => {
  const { username } = req.body;

  const checkUser = await prisma.user.findMany({
    where: { username: username },
  });

  if (checkUser.length !== 0)
    return res.json({ message: "username already taken" });

  try {
    const { error, value } = userCreateSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { username, password, email } = value;

    const hashPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username: username,
        password: hashPassword,
        email: email,
      },
    });

    res.json({ message: "Successfuly create new user" });
  } catch (error) {
    res.json({ error: error.message });
  }
};

export const Login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: { username: username },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user.id }, "secret", { expiresIn: "1h" });

    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.json({ error: error.message });
  }
};

export const Logout = async (req, res) => {
  try {
    res.cookie("token", "", { expires: new Date(0), httpOnly: true });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.json({ error: error.message });
  }
};
