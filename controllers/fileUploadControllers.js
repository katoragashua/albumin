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


/*
const uploadImage = async (req, res) => {
  console.log(req.files);
  // First check if theres a file in req.files. If not, throw an error
  if (!req.files) {
    throw new CustomError.BadRequestError("No file uploaded.");
  }
  // If there's a req.file, assign req.files.image to a variable
  const img = req.files.image;
  // Check if the file format is an image by checking req.files.mimetype. If not, throw an error.
  if (!img.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please upload an image.");
  }

  // Optionally you can limit the size of images to 5mb
  const maxSize = 1024 * 1024 * 5;
  if (img.size > maxSize) {
    throw new CustomError.BadRequestError("Image must be less than 5mb.");
  }
  // Use the path module to assign the image to a path you want it to be saved. As seen below.
  const imgPath = path.resolve(
    __dirname,
    "../uploads",
    `${img.name}`
  );
  // Use the express fileUpload method mv() to move the image file to the folder. This is asynchronous
  await productImg.mv(imgPath);

  res.status(StatusCodes.OK).json({
    image: { src: `/uploads/${productImg.name}` },
    msg: "Image uploaded succesfully",
  });
};

*/

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
