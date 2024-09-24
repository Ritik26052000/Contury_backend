const express = require("express");
const cors = require("cors");
const connectToDB = require("./configs/db");
const userRouter = require("./routes/userRoutes");
require("dotenv").config();

const port = process.env.PORT;
const db_url = process.env.MONGODB_URL;

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("this is home route");
});

app.use('/user', userRouter)

app.listen(port, async () => {
  try {
    await connectToDB(db_url);
    console.log("connected to database");
    console.log(`Server is running at http://localhost:${port}`);
  } catch (err) {
    console.log(err);
  }
});
