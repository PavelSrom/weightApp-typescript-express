import { Document, Model, model, Schema } from "mongoose"
import { IUser } from "../models/User"

export interface IProfile extends Document {
  _id: string
  user: IUser["_id"]
  desiredWeight: number
  height: number
  kcalIntake: number
  chosenExercise: {
    name?: string
    kcalHour?: number
  }
}

const profileSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  desiredWeight: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  kcalIntake: {
    type: Number,
    required: true
  },
  chosenExercise: {
    name: {
      type: String
    },
    kcalHour: {
      type: Number
    }
  }
})

const Profile: Model<IProfile> = model("Profile", profileSchema)

export default Profile
