const { Schema, default: mongoose, model } = require("mongoose");
const CustomError = require("../errors/index");

const LocationSchema = new Schema({
  city: { type: String, required: true },
  country: { type: String, required: true },
  long: { type: Number },
  lat: { type: Number },
});

const ExifSchema = new Schema({
  make: {
    type: String,
    default: null,
  },
  model: { type: String, default: null },
  lensModel: { type: String, default: null },
});

// const LikeSchema = new Schema(
//   {
//     user: { type: mongoose.Types.ObjectId, ref: "User" },
//     photo: { type: mongoose.Types.ObjectId, ref: "Photo" },
//   },
//   { timestamps: true }
// );

const PhotoSchema = new Schema(
  {
    url: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      required: [true, "Please enter a description"],
      maxlength: 200,
      trim: true,
    },
    location: {
      type: LocationSchema,
    },
    tags: { type: [String] },
    height: { type: Number, default: null },
    width: { type: Number, default: null },
    orientation: {
      type: String,
      enum: ["vertical", "horizontal", "squarish"],
    },
    exif: {
      type: ExifSchema,
      default: {},
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    likes: { type: [mongoose.Types.ObjectId] },
    downloads: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

PhotoSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "photo",
  justOne: false,
  // match: {rating: {$lte: 3}}, //This matches products by rating. i.e., less than or equal 5
  // match: {rating: 5}, //Matches for rating = 5
});

// PhotoSchema.pre("remove", async function (next) {
//   await this.model("Comment").deleteMany({ photo: this._id });
//   next();
// });

module.exports = mongoose.model("Photo", PhotoSchema);

// {type:mongoose.Types.ObjectId, ref: "Comment"}
