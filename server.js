require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./app/utils/db");

const videoRoutes = require("./app/routes/videoRoutes");

const app = express();
const port = process.env.PORT;

// Connect to DocumentDB
connectDB();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
// Middleware
app.use(express.json());

// Routes
app.use("/upload/", videoRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});