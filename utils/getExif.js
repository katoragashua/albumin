const CustomError = require("../errors/index");
const exifLib = require("fast-exif");
// const exifr = require("exifr");

const getExif = async (filePath) => {
  /*Getting exif Data */
  // const exifData = await exifr.parse(req.files.image.tempFilePath);
  const exifData = await exifLib.read(filePath);
  if (!exifData) {
    throw new CustomError.BadRequestError(
      "Photo has no metadata. Please upload only photos taken from a camera."
    );
  }

  const {
    image: { Make, Model, Orientation },
    exif: { LensModel },
  } = exifData;
  return { Make, Model, Orientation, LensModel };
};

module.exports = getExif;
