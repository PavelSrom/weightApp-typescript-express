import jwt from "jsonwebtoken"
import { Req, Res, Next } from "../types"

interface Token {
  id: string
}

export default function(req: Req, res: Res, next: Next) {
  const token = req.header("x-auth-token")
  if (!token) return res.status(401).json({ message: "Missing token" })

  try {
    const decoded = jwt.verify(token, "pavelskisecret") as Token
    req.userID = decoded.id

    next()
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" })
  }
}

// export default auth
