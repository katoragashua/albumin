const { Schema, default: mongoose, model } = require("mongoose");
const CustomError = require("../errors/index");

const LocationSchema = new Schema({
  city: { type: String, required: true },
  country: { type: String, required: true },
  long: { type: Number },
  lat: { type: Number },
});

const CommentSchema = new Schema({
  user: { type: mongoose.Types.ObjectId, required: true },
  photo: { type: mongoose.Types.ObjectId, required: true },
  comment: { type: String, required: true },
});

const LikeSchema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    photo: { type: mongoose.Types.ObjectId, ref: "Photo" },
  },
  { timestamps: true }
);

const PhotoSchema = new Schema(
  {
    url: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      required: [true, "Please enter a decription"],
      maxlength: 200,
      trim: true,
    },
    location: {
      type: LocationSchema,
    },
    tags: { type: [String] },
    height: { type: Number },
    width: { type: Number },
    orientation: {
      type: String,
      enum: ["vertical", "horizontal", "square"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    likes: { type: [mongoose.Types.ObjectId] },
    comments: { type: [CommentSchema] },
    downloads: { type: [mongoose.Types.ObjectId] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Photo", PhotoSchema);
