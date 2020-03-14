import { Req, Res, Router } from "../types"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import auth from "../middleware/auth"
import { check, validationResult } from "express-validator"
import User, { IUser } from "../models/User"
const router = Router()

// DESC:			verify user's token
// ACCESS:		private
// ENDPOINT:	/api/auth
router.get("/", auth, async (req: Req, res: Res) => {
  try {
    const user: IUser | null = await User.findById(req.userID).select(
      "-password"
    )

    return res.send(user)
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

// DESC:			register new user
// ACCESS:		public
// ENDPOINT:	/api/auth/register
interface RegisterBody {
  name: string
  email: string
  password: string
}
router.post(
  "/register",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Must be an email").isEmail(),
    check("password", "Password 6 chars").isLength({ min: 6 })
  ],
  async (req: Req<RegisterBody>, res: Res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).send({ errors: errors.array() })

    const { name, email, password } = req.body // autocompleted

    try {
      const userExists: IUser | null = await User.findOne({ email })
      if (userExists)
        return res.status(400).json({ msg: "Email already in use" })

      const user = new User({ name, email, password })
      user.password = await bcrypt.hash(password, 8)
      await user.save()

      const token = jwt.sign({ id: user.id }, "pavelskisecret", {
        expiresIn: 3600
      })

      return res.send({ token })
    } catch ({ message }) {
      console.log(message)
      return res.status(500).send({ message })
    }
  }
)

// DESC:			login existing user
// ACCESS:		public
// ENDPOINT:	/api/auth/login
interface LoginBody {
  email: string
  password: string
}
router.post(
  "/login",
  [
    check("email", "Must be an email").isEmail(),
    check("password", "Password 6 chars").isLength({ min: 6 })
  ],
  async (req: Req<LoginBody>, res: Res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() })

    const { email, password } = req.body

    try {
      const user: IUser | null = await User.findOne({ email })
      if (!user) return res.status(400).send({ message: "Invalid email" })

      const match = await bcrypt.compare(password, user.password)
      if (!match) return res.status(400).send({ message: "Invalid password" })

      const token = jwt.sign({ id: user.id }, "pavelskisecret", {
        expiresIn: 3600
      })

      return res.send({ token })
    } catch ({ message }) {
      console.log(message)
      return res.status(500).send({ message })
    }
  }
)

export default router
