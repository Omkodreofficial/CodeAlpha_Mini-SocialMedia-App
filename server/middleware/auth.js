import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev_secret_no_one_should_use";

export function requireAuth(req, res, next) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  const token = h.split(" ")[1];

  try {
    const payload = jwt.verify(token, SECRET);
    const id =
      payload.userId ??
      payload.user_id ??
      payload.userID ??
      payload.id ??
      (payload.user && payload.user.id) ??
      null;

    if (!id) {
      console.error("Auth middleware: no user id found in token payload", payload);
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.user = { id: Number(id) };
    return next();
  } catch (err) {
    console.error("Auth verify error:", err?.message || err);
    return res.status(401).json({ error: "Invalid token" });
  }
}