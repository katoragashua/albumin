const mongoose = require("mongoose");
const express = require("express");
require("express-async-errors");
const app = express();
const { config } = require("dotenv");
config();
const {
  searchPhotos,
  getFollowingPhotos,
} = require("./controllers/photoControllers");

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
const Photo = require("./models/Photo");
const Comment = require("./models/Comment");

// Import DB
const connectDb = require("./db/connect");
// Import Routers
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const photoRouter = require("./routes/photoRoutes");
const commentRouter = require("./routes/commentRoutes");
const { log } = require("console");
const { uploadImage } = require("./controllers/fileUploadControllers");

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Use external packages
app.use(cookieParser(process.env.JWT_SECRET));
app.use(morgan("tiny"));
// Use express middlewares
app.use(express.json());
// app.use(express.urlencoded({ extended: true}))
app.use(fileUpload({ useTempFiles: true }));
app.use(cors());

// Use Routers
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/photos", photoRouter);
app.use("/api/v1/comments", commentRouter);
app.post("/api/v1/upload-image", authenticateUser, uploadImage);
app.get("/api/v1/images/search/:search?", searchPhotos);
app.get("/api/v1/following",authenticateUser, getFollowingPhotos);

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
    // await Photo.deleteMany();
    // await Comment.deleteMany();
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
