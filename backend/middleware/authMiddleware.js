import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.cookies?.authToken;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
};

export default authMiddleware;
