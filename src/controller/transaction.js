import jwt from "jsonwebtoken";
import { prisma } from "../utils/index.js";
import { transactionSchema } from "../validator/index.js";

export const getTransaction = async (req, res) => {
  const { token } = req.cookies;

  const { userId } = jwt.verify(token, "secret");

  try {
    const userTransaction = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: { transactions: true },
    });
    res.send({ userTransaction, message: "User transactions!" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const createTransaction = async (req, res) => {
  const { token } = req.cookies;

  const { userId } = jwt.verify(token, "secret");

  try {
    const { error, value } = transactionSchema.validate(req.body);

    if (error) return res.status(400).json({ error: error.details[0].message });

    const accountId = await prisma.account.findFirst({
      where: { userId: userId },
      select: {
        id: true,
        name: true,
      },
    });

    const { amount, type, description } = value;

    const newTransaction = await prisma.transaction.create({
      data: {
        amount: amount,
        type: type,
        description: description,
        userId: userId,
      },
    });

    const updateAccount = await prisma.account.update({
      where: { id: accountId.id },
      data: { balance: { increment: amount } },
    });

    res.json({ message: "Transaction success!" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    await prisma.transaction.delete({ where: { id: req.params.id } });

    res.json({ message: "Transaction successfully deleted!" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
