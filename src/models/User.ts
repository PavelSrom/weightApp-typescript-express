import { Document, Model, model, Schema } from "mongoose"

export interface IUser extends Document {
  _id: string
  name: string
  email: string
  password: string
}

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
})

const User: Model<IUser> = model("User", userSchema)

export default User
