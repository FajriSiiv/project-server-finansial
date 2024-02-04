import Joi from "joi";

// validator joi create user
export const userCreateSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  email: Joi.string().email(),
});

export const transactionSchema = Joi.object({
  amount: Joi.number().positive().required(),
  type: Joi.string()
    .valid(
      "income",
      "expense",
      "transfer",
      "invesment",
      "loan",
      "refund",
      "salary",
      "interest",
      "fee"
    )
    .required(),
  description: Joi.string().allow(null, "").optional(),
});

// // validator joi create expense
// export const expenseCreateSchema = Joi.object({
//   amount: Joi.number().positive().required(),
//   category: Joi.string()
//     .valid("Food", "Transport", "Housing", "Hobby", "Shopping")
//     .required(),
//   notes: Joi.string().allow("").trim(),
// });
