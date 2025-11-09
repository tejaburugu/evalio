
// module.exports = verifyJWT;
import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT tokens
 */
export default function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // Expecting "Bearer <token>"
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid authorization header" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = decoded; // attach decoded token payload to request
    next();
  });
}
