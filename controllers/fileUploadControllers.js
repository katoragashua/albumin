const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const { StatusCodes } = require("http-status-codes");
const { log } = require("console");
const CustomError = require("../errors/index");
const exifLib = require("fast-exif");
const ImageKit = require("imagekit");
const utilFuncs = require("../utils/index");

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
  const minSize = 1024 * 1024 * 5;
  if (img.size > maxSize)
    // if (img.size > maxSize || img.size < minSize)
    throw new CustomError.BadRequestError(
      "Image must be greater than 3mb less than 15mb."
    );

  // Use the path module to assign the image to a path you want it to be saved. As seen below.
  const imgPath = path.resolve(__dirname, "../uploads", `${img.name}`);
  await img.mv(imgPath);
  // Getting exif data
  const exifData = await utilFuncs.getExif(imgPath);

  // Uploading to cloudinary
  const result = await cloudinary.uploader.upload(imgPath, {
    use_filename: true,
    folder: "albumin",
  });

  // Destructuring result
  const { secure_url, height, width } = result;
  const tags = await utilFuncs.tagImage(secure_url);

  // Destructuring exifData
  const {
    Make: make,
    Model: model,
    Software: software,
    LensModel: lensModel,
  } = exifData;
  let orientation;
  let ratio = width / height;

  if(ratio >= 0.8 && ratio <= 1.2) {
    orientation = "squarish";
  }else if((ratio < 0.8)) {
    orientation = "portrait";
  }else if(ratio > 1.2)  {
    orientation = "landscape";
  }
  
  // Removing the tempfiles
  fs.unlinkSync(imgPath);

  res.status(StatusCodes.OK).json({
    secure_url,
    height,
    width,
    make,
    model,
    software,
    orientation,
    lensModel,
    tags,
  });
};

// Upload using cloudinary
// const uploadImage = async (req, res) => {
//   // First check if theres a file in req.files. If not, throw an error
//   if (!req.files) {
//     throw new CustomError.BadRequestError("No file uploaded.");
//   }
//   // If there's a req.file, assign req.files.image to a variable
//   const img = req.files.image;
//   // Check if the file format is an image by checking req.files.mimetype. If not, throw an error.
//   if (!img.mimetype.startsWith("image")) {
//     throw new CustomError.BadRequestError("Please upload an image.");
//   }

//   // Optionally you can limit the size of images to 15mb
//   const maxSize = 1024 * 1024 * 15;
//   const minSize = 1024 * 1024 * 5;
//   if (img.size > maxSize)
//     // if (img.size > maxSize || img.size < minSize)
//     throw new CustomError.BadRequestError(
//       "Image must be greater than 3mb less than 15mb."
//     );

//   // Getting exif data
//   const exifData = await utilFuncs.getExif(img.tempFilePath);

//   // Uploading to cloudinary
//   const result = await cloudinary.uploader.upload(
//     img.tempFilePath,
//     {
//       use_filename: true,
//       folder: "albumin",
//       categorization: "aws_rek_tagging",
//       auto_tagging: 0.7,
//     }
//   );

//   // Destructuring result
//   const {
//     secure_url,
//     height,
//     width,
//     tags: taggs
//   } = result;
//   const tags = await utilFuncs.tagImage(secure_url);

//   // Destructuring exifData
//   const { Make, Model, Orientation, LensModel } = exifData;

//   // Removing the tempfiles
//   fs.unlinkSync(img.tempFilePath);

//   res.status(StatusCodes.OK).json({
//     secure_url,
//     height,
//     width,
//     taggs,
//     Make,
//     Model,
//     Orientation,
//     LensModel,
//     tags,
//   });
// };

module.exports = {
  uploadImage,
};

// // Using ImageKit
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
//         name: "google-auto-tagging", // or "aws-auto-tagging":
//         maxTags: 20,
//         minConfidence: 65,
//       },
//     ],
//   });
//   res.status(StatusCodes.OK).json({ image });
// };
