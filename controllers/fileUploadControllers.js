const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const { StatusCodes } = require("http-status-codes");
const exifr = require("exifr");
const ExifImage = require("exif").ExifImage;
const { log } = require("console");

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// const uploadImage = async (req, res) => {
//   console.log(req.files);
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

//   // Optionally you can limit the size of images to 5mb
//   const maxSize = 1024 * 1024 * 5;
//   if (img.size > maxSize) {
//     throw new CustomError.BadRequestError("Image must be less than 5mb.");
//   }
//   // Use the path module to assign the image to a path you want it to be saved. As seen below.
//   const imgPath = path.resolve(__dirname, "../uploads", `${img.name}`);

//   console.log(imgPath);
//   // Use the express fileUpload method mv() to move the image file to the folder. This is asynchronous
//   await img.mv(imgPath);

//   try {
//     await new ExifImage({ image: imgPath }, function (error, exifData) {
//       if (error) console.log("Error: " + error.message);
//       else console.log(exifData); // Do something with your data!
//       fs.unlink(imgPath, (err) => {
//         if (err) console.log("Error: " + err.message);
//         console.log("File removed");
//       });
//     });
//   } catch (error) {
//     console.log("Error: " + error.message);
//   }

//   //  fs.unlink(imgPath, (err) => {
//   //    if (err) console.log("Error: " + err.message);
//   //    console.log("File removed");
//   //  });

//   res.status(StatusCodes.OK).json({
//     image: { src: `/uploads/${img.name}` },
//     msg: "Image uploaded succesfully",
//   });
// };

const getExifData= async (req) => {
  console.log(req.files.image);
  if (!req.files) {
    throw new CustomError.BadRequestError("No file uploaded.");
  }
  const img = req.files.image;
  if (!img.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please upload an image.");
  }
  const imgPath = path.resolve(__dirname, "../uploads", `${img.name}`);
  await img.mv(imgPath);
  // const data = new ExifImage({ image: imgPath }, function (error, data) {
  //   if (error) console.log("Error: " + error.message);
  //   console.log("Success: ", data); // Do something with your data!
  //   fs.unlink(imgPath, (err) => {
  //     if (err) console.log("Error: " + err.message);
  //     console.log("File removed");
  //   });
  // });
  const exifData = await exifr.parse(imgPath);
  fs.unlink(imgPath, (err) => {
    if (err) console.log("Error: " + err.message);
    console.log("File removed");
  });
  return exifData
};

const uploadImage = async (req, res) => {
  // const exifData = await getExifData(req);
  // console.log(exifData);
  const img = req.files.image.tempFilePath;
  console.log("img",img);
  const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
    use_filename: true,
    folder: "file_upload",
  });
  console.log("result",result);

  // Removing the tempfiles
  fs.unlinkSync(img.tempFilePath);

  // fs.unlink(imgPath, (err) => {
  //   if (err) {
  //     console.log(err);
  //     console.log("Success");
  //   }
  // });
  // const file = fs.readFile(
  //   path.resolve(__dirname, "../tmp/", "tmp-1-1682854369143"),
  //   (err, data) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //     console.log(data);
  //   }
  // );
  res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

module.exports = {
  uploadImage,
};
