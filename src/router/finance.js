import express from "express";
import {
  createFinance,
  getFinanceDetail,
  getFinanceUser,
  updateFinance,
} from "../controller/finance.js";
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
} from "../controller/transaction.js";
import { Login, Logout, Register } from "../controller/user.js";
import { isLoggedIn } from "../middleware/auth.js";

const router = express.Router();

// user
router.post("/v1/api/register", Register);
router.post("/v1/api/login", Login);
router.get("/v1/api/logout", isLoggedIn, Logout);

// account
router.get("/finance", isLoggedIn, getFinanceUser);
router.get("/finance/:id", isLoggedIn, getFinanceDetail);
router.post("/finance", isLoggedIn, createFinance);
router.patch("/finance/:id", isLoggedIn, updateFinance);

// transaction
router.get("/transaction", isLoggedIn, getTransaction);
router.delete("/transaction/:id", isLoggedIn, deleteTransaction);
router.post("/transaction", isLoggedIn, createTransaction);

export default router;
