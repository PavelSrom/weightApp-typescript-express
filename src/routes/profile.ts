import { Req, Res, Router } from "../types"
import { check, validationResult } from "express-validator"
import auth from "../middleware/auth"
import Profile, { IProfile } from "../models/Profile"
const router = Router()

// DESC:			get user's profile
// ACCESS:		private
// ENDPOINT:	/api/auth/profile
router.get("/", auth, async (req: Req, res: Res) => {
  try {
    const profile: IProfile | null = await Profile.findOne({ user: req.userID })

    return res.send(profile)
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

// DESC:			create user's profile
// ACCESS:		private
// ENDPOINT:	/api/auth/profile
interface ProfileCreateBody {
  desiredWeight: number
  height: number
  kcalIntake: number
}
router.post(
  "/",
  [
    auth,
    check("desiredWeight", "Please enter a valid number").isInt(),
    check("height", "Please enter a valid number").isInt(),
    check("kcalIntake", "Please enter a valid number").isInt()
  ],
  async (req: Req<ProfileCreateBody>, res: Res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).send({ errors: errors.array() })

    try {
      const profile: IProfile | null = await Profile.findOne({
        user: req.userID
      })
      if (profile)
        return res.status(400).send({ message: "Profile already exists" })

      const newProfile = new Profile({ user: req.userID, ...req.body })
      await newProfile.save()

      return res.status(201).send(newProfile)
    } catch ({ message }) {
      console.log(message)
      return res.status(500).send({ message })
    }
  }
)

// DESC:			update user's profile
// ACCESS:		private
// ENDPOINT:	/api/auth/profile
interface ProfileUpdateBody {
  desiredWeight?: number
  kcalIntake?: number
  chosenExercise?: {
    name: string
    kcalHour: number
  }
}
router.put("/", auth, async (req: Req<ProfileUpdateBody>, res: Res) => {
  const { desiredWeight, kcalIntake, chosenExercise } = req.body

  try {
    const profile: IProfile | null = await Profile.findOne({ user: req.userID })
    if (!profile) return res.status(404).send({ message: "Profile not found" })

    if (desiredWeight) profile.desiredWeight = desiredWeight
    if (kcalIntake) profile.kcalIntake = kcalIntake
    if (chosenExercise) profile.chosenExercise = chosenExercise

    await profile.save()

    return res.send(profile)
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

export default router
