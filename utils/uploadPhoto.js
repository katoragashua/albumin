const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");

// cloudinary SDK configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


// Upload using cloudinary
const uploadPhoto = async (filePath) => {

  // Uploading to cloudinary
  const result = await cloudinary.uploader.upload(
    filePath,
    {
      use_filename: true,
      folder: "albumin",
    }
  );

  // Destructuring result
  const { secure_url, height, width} = result;

  // Removing the tempfiles
  fs.unlinkSync(filePath);

  return {
    secure_url,
    height,
    width
  };
};


module.exports = uploadPhoto