// const apiKey = process.env.IMAGGA_KEY;
// const apiSecret = process.env.IMAGGA_SECRET;
const apiKey = "acc_308055dc1725ecf";
const apiSecret = "ec365966f2ef49cb8cee8385d181feee";
const express = require("express");
const app = express();
const getGot = import("got");

// const imageUrl =
//   "https://ik.imagekit.io/vjugbonpd/image_xeG7P_Den?updatedAt=1683119703523";
// const imaggaEndpoint = "https://api.imagga.com/v2/tags";

// const tagImage = async (req, res) => {
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
//   if (img.size > maxSize)
//     throw new CustomError.BadRequestError("Image must be less than 15mb.");

//   const formData = new FormData();
//   formData.append("image", fs.createReadStream(req.files.image.tempFilePath));
//   try {
//     const response = await got.post("https://api.imagga.com/v2/tags", {
//       body: formData,
//       username: apiKey,
//       password: apiSecret,
//     });
//     console.log(response.body);
//   } catch (error) {
//     console.log(error.response.body);
//   }
// };

// const tagImage = async (req, res) => {
//   const got = await getGot
//   const image =
//     "https://imagga.com/static/images/tagging/wind-farm-538576_640.jpg";
//   const url =
//     "https://api.imagga.com/v2/tags?image_url=" + encodeURIComponent(image);
//   try {
//     const response = await got.got.get(url, {
//       username: apiKey,
//       password: apiSecret,
//     });
//     console.log("response:  ", response.body);
//     res.status(200).json(response.body);
//   } catch (error) {
//     console.log("error: ", error.response.body);
//   }
// };

const tagImage = async (req, res) => {
  const {got} = await getGot;
  const image =
    "https://ik.imagekit.io/vjugbonpd/image_xeG7P_Den?updatedAt=1683119703523";
  const url =
    "https://api.imagga.com/v2/tags?image_url=" + encodeURIComponent(image);
  try {
    const response = await got.get(url, {
      username: apiKey,
      password: apiSecret,
    });
    console.log("response:  ", response.body);
    res.status(200).json(response.body);
  } catch (error) {
    console.log("error: ", errorresponse.body);
  }
};


module.exports = {
  tagImage,
};
