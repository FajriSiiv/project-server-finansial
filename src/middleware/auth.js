export const isLoggedIn = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  next();
};
