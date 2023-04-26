const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const { StatusCodes } = require("http-status-codes");

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// const uploadImage = async (req, res) => {
//   if (!req.files) {
//     throw new customErrors.BadRequestError("Please add a file.");
//   }

//   const img = req.files.image;

//   if (!req.files.image.mimetype.startsWith("image/")) {
//     throw new customErrors.BadRequestError("Format must be an image.");
//   }

//   if (img.size > process.env.MAX_SIZE) {
//     throw new customErrors.BadRequestError("Image size must be less than 5mb.");
//   }

//   const imgPath = path.resolve(__dirname, "../uploads", `${img.name}`);
//   await img.mv(imgPath);
//   res.status(StatusCodes.OK).json({ image: { src: `/uploads/${img.name}` } });
// };

const uploadImage = async (req, res) => {
  // console.log(req.files.image);
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    { use_filename: true, folder: "file_upload" }
  );

  // Removing the tempfiles
  fs.unlinkSync(req.files.image.tempFilePath);
  res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

module.exports = {
  uploadImage,
};
