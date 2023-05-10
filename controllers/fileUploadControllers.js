const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const { StatusCodes } = require("http-status-codes");
const exifr = require("exifr");
const { log } = require("console");
const CustomError = require("../errors/index");
const exif = require("fast-exif");
const ImageKit = require("imagekit");

// Imagekit SDK configuration
const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KIT_URL,
});

// cloudinary SDK configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
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
  const imgPath = path.resolve(__dirname, "../uploads", `${img.name}`);

  console.log(imgPath);
  // Use the express fileUpload method mv() to move the image file to the folder. This is asynchronous
  await img.mv(imgPath);

  res.status(StatusCodes.OK).json({
    image: { src: `/uploads/${img.name}` },
    msg: "Image uploaded succesfully",
  });
};
*/

const uploadImage = async (req, res) => {
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

  // Optionally you can limit the size of images to 15mb
  const maxSize = 1024 * 1024 * 15;
  if (img.size > maxSize)
    throw new CustomError.BadRequestError("Image must be less than 15mb.");
  // Uploading to cloudinary
  // const result = await cloudinary.uploader.upload(
  //   req.files.image.tempFilePath,
  //   {
  //     use_filename: true,
  //     folder: "file_upload",
  //     categorization: "aws_rek_tagging",
  //     auto_tagging: 0.7,
  //   }
  // );
  // const exifData = await exifr.parse(req.files.image.tempFilePath);
  const exifData = await exif.read(req.files.image.tempFilePath);
  if (!exifData) {
    // Removing the tempfiles
    fs.unlinkSync(req.files.image.tempFilePath);
    throw new CustomError.BadRequestError(
      "Photo has no metadata. Please upload only photos taken from a camera."
    );
  }
  // const { image, exif: more } = exifData;
  // console.log(image, more);
  // get orientation
  // const orientation = await exifr.orientation(req.files.image.tempFilePath);
  // Removing the tempfiles
  fs.unlinkSync(req.files.image.tempFilePath);

  res.status(StatusCodes.OK).json({  exifData });
};

// const uploadImage = async (req, res) => {
//   if (!req.files) throw new CustomError.BadRequestError("No file uploaded.");

//   const img = req.files.image;
//   if (!img.mimetype.startsWith("image"))
//     throw new CustomError.BadRequestError("Please upload an image.");

//   // Optionally you can limit the size of images to 10mb
//   const maxSize = 1024 * 1024 * 10;
//   if (img.size > maxSize) {
//     throw new CustomError.BadRequestError("Image must be less than 5mb.");
//   }
//   // Use the path module to assign the image to a path you want it to be saved. As seen below.
//   const imgPath = path.resolve(__dirname, "../uploads", `${img.name}`);

//   console.log(imgPath);
//   // Use the express fileUpload method mv() to move the image file to the folder. This is asynchronous
//   await img.mv(imgPath);

  
//   const file = fs.readFileSync(imgPath);

//   console.log(file);
//   const image = await imagekit.upload({
//     file: file, //required
//     fileName: "image", //requiredextensions:
//     ["tag1", "tag2"], 
//     extensions: [
//       {
//         name: "google-auto-tagging", //"aws-auto-tagging":
//         maxTags: 20,
//         minConfidence: 65,
//       },
//     ],
//   });
//   res.status(StatusCodes.OK).json({ image });
// };

module.exports = {
  uploadImage,
};
