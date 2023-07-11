import React, { useEffect } from "react";
import Photo from "./Photo";
// import { getPhotos } from "../features/photos/photosSlice";
import { useDispatch, useSelector } from "react-redux";
import { all } from "axios";
import Masonry from "react-masonry-css";

const Photos = () => {
  const { photos } = useSelector((store) => store.photos);
  console.log(photos);
  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(getPhotos());
  // }, []);

  const allPhotos = photos.map((photo) => <Photo key={photo.id} {...photo} />);

  const breakpointColumnsObj = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div className="photos p-[1rem]">
   
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {allPhotos}
      </Masonry>
    </div>
  );
};

export default Photos;
