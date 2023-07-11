import React from "react";

const Hero = () => {
  return (
    <section className="hero h-[100vh] flex items-center">
      <div className="flex flex-col  w-[60%] mx-auto my-0 gap-4">
        <div className="hero-text text-white text">
          <h2 className="text-4xl font-bold">Welcome to the Albumin:</h2>
          <h4 className="text-1xl font-semibold">
            The Worlds repository of free photos.
          </h4>
        </div>
        <input
          type="search"
          name="search"
          id="search"
          placeholder="Search for images on Albumin."
          className="search-input bg-slate-100 py-[.8rem] px-8 rounded-md outline-none text-center"
        />
      </div>
    </section>
  );
};

export default Hero;
