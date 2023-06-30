const { StatusCodes } = require("http-status-codes");
const Photo = require("../models/Photo");
const CustomError = require("../errors/index");
const utilFuncs = require("../utils/index");
const User = require("../models/User");
const Comment = require("../models/Comment");
// List/Array of stop words
const stopWords = ["the", "and", "a", "an", "in", "is", "it"];
/*
// PHOTOS 
*/

// Create Photo
const createPhoto = async (req, res) => {
  const { description, url, tags } = req.body;
  if (!description || !url) {
    throw new CustomError.BadRequestError("Please enter a description or url");
  }
  const user = await User.findOne({ _id: req.user.userId });
  if (!user) throw new CustomError.NotFoundError("User not found");
  const photo = await Photo.create({
    description,
    url,
    user: req.user.userId,
    tags,
  });

  await photo.populate({
    path: "user",
    select:
      "name firstName, lastName, username, email, availableForWork, userImage, location, social",
  });
  //   await photo.save()
  console.log(photo);
  res
    .status(StatusCodes.CREATED)
    .json({ message: "Photo saved successfully.", photo });
};

// Get User Photos
const getUserPhotos = async (req, res) => {
  const photos = await Photo.find({ user: req.user.userId }).populate({
    path: "user",
    select:
      "name firstName, lastName, username, email, availableForWork, userImage, location, social",
  });
  res
    .status(StatusCodes.OK)
    .json({ message: "Success", results: photos, count: photos.length });
};

// Search Photos
const searchPhotos = async (req, res) => {
  const { orientation, sort, select } = req.query;
  const { search } = req.params;
  let searchQuery;
  const queryObj = {};
  if (search) {
    searchQuery =
      search
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .trim() || "";
    // .split(",")
    // .filter((n) => !stopWords.includes(n))
    // .filter(Boolean);
    //  Using Promise.all()
    // const allPhotos = searchQuery.map((n) => {
    //   return Photo.find({ tags: n, user: userId });
    // });
    // const photos = await (await Promise.all(allPhotos)).filter(Boolean);
    // // Using mongoDB query operators
    queryObj.tags = { $in: searchQuery };
  }

  if (orientation) queryObj.orientation = orientation;

  let result = Photo.find(queryObj);

  if (sort) {
    let sorted = sort.split(",").join(" ");
    result = result.sort(sorted);
  } else {
    result = result.sort("createdAt");
  }
  if (select) {
    let selected = select.split(",").join(" ");
    result = result.select(selected);
  }

  const perPage = +req.query.per_page || 30;
  const page = +req.query.page || 1;
  const skip = (page - 1) * perPage;

  result = result.skip(skip).limit(perPage);

  console.log(queryObj);

  if (!searchQuery) {
    const photos = await result.populate({
      path: "user",
      select:
        "name firstName, lastName, username, email, availableForWork, userImage, location, social",
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: "Success", photos, count: photos.length });
  }

  const photos = await result.populate({
    path: "user",
    select:
      "name firstName, lastName, username, email, availableForWork, userImage, location, social",
  });
  res
    .status(StatusCodes.OK)
    .json({ message: "Success", photos, count: photos.length });
};

// Get All Photos
const getAllPhotos = async (req, res) => {
  const { query, orientation, sort, select } = req.query;

  const queryObj = {};
  if (query) {
    let searchQuery = query
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .trim()
      .split(",")
      .filter((n) => !stopWords.includes(n))
      .filter(Boolean);
    queryObj.tags = { $in: searchQuery };
  }

  if (orientation) queryObj.orientation = orientation;

  let result = Photo.find(queryObj);
  if (sort) {
    let sorted = sort.split(",").join(" ");
    result = result.sort(sorted);
  }

  if (select) {
    let selected = select.split(",").join(" ");
    result = result.select(selected);
  }

  const perPage = +req.query.per_page || 30;
  const page = +req.query.page || 1;
  const skip = (page - 1) * perPage;

  result = result.skip(skip).limit(perPage);

  const photos = await result.populate({
    path: "user",
    select:
      "name firstName, lastName, username, email, availableForWork, userImage, location, social",
  });
  res
    .status(StatusCodes.OK)
    .json({ message: "Success", results: photos, count: photos.length });
};

// Get following Photos
const getFollowingPhotos = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  if (!user.following.length) {
    return res
      .status(StatusCodes.OK)
      .json({ message: "You haven't followed anyone yet", photos: [] });
  }


  // Using Promise.all(). Alternatively you can use Promise.allSettled()
  // let photos = await Promise.all(user.following.map(async(userId) => {
  //   return await Photo.find({ user: userId }).populate({
  //     path: "user",
  //     select:
  //       "name firstName, lastName, username, email, availableForWork, userImage, location, social",
  //   });;
  // }));

  // photos = photos.reduce((acc, cur) => acc.concat(cur), []);

  let photos = await Photo.find({ user: { $in: user.following } })
    .sort("createdAt")
    .populate({
      path: "user",
      select:
        "name firstName, lastName, username, email, availableForWork, userImage, location, social",
    });
  res.status(StatusCodes.OK).json({ message: "Success", photos });
};

// Get Single Photos
const getSinglePhoto = async (req, res) => {
  const { id: photoId } = req.params;
  const photo = await Photo.findOne({ _id: photoId });
  if (!photo) {
    throw new CustomError.NotFoundError("Photo was no found");
  }
  await photo.populate({
    path: "user",
    select:
      "name firstName, lastName, username, email, availableForWork, userImage, location, social",
  });
  await photo.populate("comments");
  res.status(StatusCodes.OK).json({ message: "Success", photo });
};

// Update Photo
const updatePhoto = async (req, res) => {
  const { id: photoId } = req.params;
  const { description, tags, city, country } = req.body;
  const photo = await Photo.findOne({ _id: photoId, user: req.user.userId });
  if (!photo) {
    throw new CustomError.NotFoundError("Photo was not found");
  }
  utilFuncs.checkPermissions(req.user, photo.user);
  photo.description = description || photo.description;
  photo.tags = tags;
  photo.city = city;
  photo.country = country;
  await photo.save();
  res.status(StatusCodes.OK).json({ message: "Success", photo });
};

// Delete Photo
const deletePhoto = async (req, res) => {
  const { id: photoId } = req.params;
  const photo = await Photo.findOne({
    _id: photoId,
  });
  if (!photo) {
    throw new CustomError.NotFoundError("Photo was not found");
  }
  utilFuncs.checkPermissions(req.user, photo.user);
  await Comment.deleteMany({ photo: photoId });
  await photo.deleteOne();
  res.status(StatusCodes.OK).json({ message: "Photo deleted" });
};

// Like and Unlike Photo
const likeAndUnlikePhoto = async (req, res) => {
  const { id: photoId } = req.params;
  const { userId } = req.user;
  const photo = await Photo.findOne({ _id: photoId });
  if (!photo) {
    throw new CustomError.NotFoundError("Photo was not found");
  }

  if (!photo.likes.includes(userId)) {
    // photo.likes = [...photo.likes, userId]; // or
    await photo.likes.push(userId);
    await photo.save();
    console.log(photo.user);
    res.status(StatusCodes.OK).json({ message: "Liked photo", photo });
    return;
  } else {
    await photo.likes.pull(userId);
    await photo.save();
    console.log(photo.user);
    res.status(StatusCodes.OK).json({ message: "Unliked photo", photo });
    return;
  }
};

// Save and Unsave Photo
const saveAndUnsavePhoto = async (req, res) => {
  const { id: photoId } = req.params;
  console.log(photoId);
  const { userId } = req.user;
  const photo = await Photo.findById({ _id: photoId });
  if (!photo) throw new CustomError.BadRequestError("Photo not found.");
  const user = await User.findById({ _id: userId });
  if (!user.savedPhotos.includes(photoId)) {
    await user.savedPhotos.push(photoId);
    await user.save();
    return res.status(StatusCodes.OK).json({ message: "Photo saved.", user });
  } else {
    await user.savedPhotos.pull(photoId);
    await user.save();
    return res.status(StatusCodes.OK).json({ message: "Photo unsaved.", user });
  }
};

const downloadPhoto = async (req, res) => {
  res
    .status(StatusCodes.OK)
    .json({ message: "Photo downloaded successfully." });
};

module.exports = {
  createPhoto,
  getAllPhotos,
  getSinglePhoto,
  getUserPhotos,
  updatePhoto,
  deletePhoto,
  likeAndUnlikePhoto,
  saveAndUnsavePhoto,
  downloadPhoto,
  searchPhotos,
  getFollowingPhotos,
};

// const likePhoto = async (req, res) => {
//   const { id: photoId } = req.params;
//   const photo = await Photo.findOne({ _id: photoId });
//   // const user = await User.findOne({_id: req.user.userId})
//   if (!photo) {
//     throw new CustomError.NotFoundError("Photo was not found");
//   }
//   const likeObj = {
//     user: req.user.userId,
//     photo: photo._id,
//   };

//   for (like of photo.likes) {
//     if (like.user.toString() === likeObj.user) {
//       throw new CustomError.UnauthorizedError("Photo already liked by user");
//     }
//     photo.likes = [...photo.likes, likeObj];
//   }
//   await photo.save();
//   console.log(photo.user);
//   res.status(StatusCodes.OK).json({ message: "Liked photo", photo });
// };
