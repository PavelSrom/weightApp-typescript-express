import express from "express"
import mongoose from "mongoose"
import config from "config"
const app = express()

import auth from "./routes/auth"
import exercises from "./routes/exercises"
import profile from "./routes/profile"
import logs from "./routes/logs"

app.use(express.json())
app.use("/api/auth", auth)
app.use("/api/exercises", exercises)
app.use("/api/profile", profile)
app.use("/api/logs", logs)

mongoose
  .connect(config.get("mongoURI"), {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Database connected"))
  .catch(err => {
    console.log(err)
    console.log("Error: database not connected")
  })

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`))
