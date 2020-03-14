import { Req, Res, Router } from "../types"
import Log, { ILog } from "../models/Log"
import { check, validationResult } from "express-validator"
import auth from "../middleware/auth"
const router = Router()

// DESC:			get user's logs
// ACCESS:		private
// ENDPOINT:	/api/auth/logs
router.get("/", auth, async (req: Req, res: Res) => {
  try {
    const logs: ILog[] = await Log.find({ user: req.userID }).sort({
      createdAt: -1
    })

    return res.send(logs)
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

// DESC:			post a new log
// ACCESS:		private
// ENDPOINT:	/api/auth/logs
interface PostLogBody {
  weight: number
}
router.post(
  "/",
  [auth, check("weight", "Weight is required").isFloat()],
  async (req: Req<PostLogBody>, res: Res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).send({ errors: errors.array() })

    const { weight } = req.body

    try {
      const newLog = new Log({
        user: req.userID,
        weight
      })
      await newLog.save()

      return res.status(201).send(newLog)
    } catch ({ message }) {
      console.log(message)
      return res.status(500).send({ message })
    }
  }
)

// DESC:			update existing log
// ACCESS:		private
// ENDPOINT:	/api/auth/logs
interface UpdateLogBody {
  weight?: number
}
router.put(
  "/:id",
  [auth, check("weight", "Weight is required").isFloat()],
  async (req: Req<UpdateLogBody>, res: Res) => {
    const { weight } = req.body

    try {
      const logToUpdate: ILog | null = await Log.findById(req.params.id)
      if (!logToUpdate)
        return res.status(400).send({ message: "Log not found" })

      if (weight) logToUpdate.weight = weight
      await logToUpdate.save()

      return res.send(logToUpdate)
    } catch ({ message }) {
      console.log(message)
      return res.status(500).send({ message })
    }
  }
)

export default router
