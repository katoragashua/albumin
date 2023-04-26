const mongoose = require("mongoose");
const express = require("express");
require("express-async-errors");
const app = express();
const { config } = require("dotenv");
config();

const morgan = require("morgan");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandlerMiddleware");
const { authenticateUser } = require("./middlewares/authentication");

// Import models
const User = require("./models/User");
const Token = require("./models/Token");

// Import DB
const connectDb = require("./db/connect");
// Import Routers
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const { log } = require("console");
const { uploadImage } = require("./controllers/fileUploadControllers");

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Use external packages
app.use(cookieParser(process.env.JWT_SECRET));
app.use(morgan("tiny"));
// Use express middlewares
app.use(express.json());
// app.use(express.urlencoded({ extended: true}))
app.use(fileUpload({ useTempFiles: true }));


// Use Routers
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);

app.post("/api/v1/upload-image", authenticateUser, uploadImage);

app.get("/", (req, res) => {
  res.send("<h1>Lens App.</h1>");
});

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    // await User.deleteMany();
    // await Token.deleteMany();
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
