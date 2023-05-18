const CustomError = require("../errors/index");
const exifLib = require("fast-exif");
// const exifr = require("exifr");

const getExif = async (filePath) => {
  /*Getting exif Data */
  // const exifData = await exifr.parse(req.files.image.tempFilePath);
  const exifData = await exifLib.read(filePath);
  const {
    image: { Make, Model, Software },
    exif: { LensModel },
  } = exifData;
  if (!Make || !Model) {
    throw new CustomError.BadRequestError(
      "Photo has no metadata. Please upload only photos taken from a camera."
    );
  }
  return { Make, Model, Software, LensModel };
};

module.exports = getExif;
