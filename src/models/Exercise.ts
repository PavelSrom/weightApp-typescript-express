import { Document, Model, model, Schema } from "mongoose"

export interface IExercise extends Document {
  _id: string
  name: string
  kcalHour: number
}

const exerciseSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  kcalHour: {
    type: Number,
    required: true
  }
})

const Exercise: Model<IExercise> = model("Exercise", exerciseSchema)

export default Exercise
