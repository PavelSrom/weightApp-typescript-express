import { Router, Req, Res } from "../types"
import Exercise, { IExercise } from "../models/Exercise"
import auth from "../middleware/auth"
const router = Router()

// DESC:			get all exercises
// ACCESS:		private
// ENDPOINT:	/api/auth/exercises
router.get("/", auth, async (req: Req, res: Res) => {
  try {
    const exercises: IExercise[] = await Exercise.find()

    return res.send(exercises)
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

// DESC:			post a new exercise (temporary)
// ACCESS:		private
// ENDPOINT:	/api/auth/exercises
interface ExerciseBody {
  name: string
  kcalHour: number
}
router.post("/", auth, async (req: Req<ExerciseBody>, res: Res) => {
  try {
    const newExercise = new Exercise(req.body)
    await newExercise.save()

    return res.status(201).send(newExercise)
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

export default router
