const fs = require("fs");
const path = require("path");
const { StatusCodes } = require("http-status-codes");
const exifr = require("exifr");
const CustomError = require("../errors/index");
const exifLib = require("fast-exif");
const apiKey = process.env.IMAGGA_KEY;
const apiSecret = process.env.IMAGGA_SECRET;
const axios = require("axios");

const imageUrl =
  "https://ik.imagekit.io/vjugbonpd/image_xeG7P_Den?updatedAt=1683119703523";
const imaggaEndpoint = "https://api.imagga.com/v2/tags";

// const getExif = async (req, res) => {
//   const headers = {
//     Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString(
//       "base64"
//     )}`,
//   };

//   axios
//     .post(
//       imaggaEndpoint,
//       {
//         image_url: imageUrl,
//       },
//       {
//         headers: headers,
//       }
//     )
//     .then((response) => {
//       res.status(StatusCodes.OK).json(response.data.result)
//     })
//     .catch((error) => {
//       console.error(error);
//       res.status(StatusCodes.OK).json(error.message);
//     });
// };

const getExif = async (req, res) => {
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

  /*Getting exif Data */

  // const exifData = await exifr.parse(req.files.image.tempFilePath);
  const exifData = await exifLib.read(req.files.image.tempFilePath);
  if (!exifData) {
    throw new CustomError.BadRequestError(
      "Photo has no metadata. Please upload only photos taken from a camera."
    );
  }

  const {
    image: { Make, Model, Orientation },
    exif: { LensModel },
  } = exifData;
  res.status(StatusCodes.OK).json({ Make, Model, Orientation, LensModel });
};

module.exports = getExif;
