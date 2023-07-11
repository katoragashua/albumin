import React from "react";
import { like, save, download } from "./Icons";

const Photo = (props) => {
  const { id, urls, user, alt_description, width, height } = props;
  // console.log(width, height);

  return (
    <div className="photo relative">
      <div className="interactions flex gap-[1rem] absolute top-5 left-5 p-2  rounded-md  bg-[rgba(255,255,255,.5)]">
        <div className="like">{like}</div>
        <div className="save">{save}</div>
        <div className="download">{download}</div>
      </div>
      <img src={urls.regular} alt={alt_description} className="photo-main" />
      <div className="photographer absolute bottom-5 left-5">
        <span
          style={{
            textShadow: "2px 2px 2px black",
            color: "white"
          }}
        >
          {user.username}
        </span>
      </div>
    </div>
  );
};

export default Photo;
