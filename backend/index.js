const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend Habit Hacker is running!" });
});

const PORT = process.env.PORT | 5000;

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:$8000`);
});
