import React from "react";
import Hero from "../components/Hero";
import Photos from "../components/Photos";
import { getData } from "../utils/axios";
import { useLoaderData } from "react-router-dom";
import { useSelector } from "react-redux";

export const loader = async ({ request, params }) => {
  // console.log(request);
  // console.log(params);
  const data = await getData("https://api.unsplash.com/photos?page=1");
  return data;
};

const Home = () => {
  const data = useLoaderData();

  return (
    <div className="home">
      <Hero />
      {/* <Photos /> */}
    </div>
  );
};

export default Home;
