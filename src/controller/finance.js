import jwt from "jsonwebtoken";
import { prisma } from "../utils/index.js";

export const getFinanceUser = async (req, res) => {
  const { token } = req.cookies;

  const { userId } = jwt.verify(token, "secret");

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        email: true,
        username: true,
        id: true,
        accounts: true,
        transactions: true,
      },
    });
    res.send(user);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const getFinanceDetail = async (req, res) => {
  try {
    const userFinance = await prisma.account.findFirst({
      where: { id: req.params.id },
      include: {
        user: { select: { username: true, id: true, email: true } },
      },
    });

    res.json(userFinance);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const createFinance = async (req, res) => {
  const { token } = req.cookies;

  const { userId } = jwt.verify(token, "secret");

  const { name } = req.body;

  try {
    const checkingAccount = await prisma.account.findMany();

    if (checkingAccount.length >= 1)
      return res.status(400).json({ message: "You already have 1 account!" });

    const newFinance = await prisma.account.create({
      data: {
        name: name,
        balance: 0,
        userId: userId,
      },
    });

    res.json(newFinance);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const updateFinance = async (req, res) => {
  const { name } = req.body;

  try {
    const updateFinance = await prisma.account.update({
      where: { id: req.params.id },
      data: {
        name,
      },
    });

    res.json(updateFinance);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
