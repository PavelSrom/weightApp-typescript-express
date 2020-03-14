import { Schema, Model, model, Document } from "mongoose"
import { IUser } from "../models/User"

export interface ILog extends Document {
  _id: string
  user: IUser["_id"]
  weight: number
}

const logSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    weight: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Log: Model<ILog> = model("Log", logSchema)

export default Log
