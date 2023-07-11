import React from 'react'
import searchIcon from "../assets/images/search-line.svg";
const Search = () => {
  return (
    <div className="search w-[50%]">
      <input
        type="search"
        name="search"
        id="search"
        placeholder="Search images"
        className="search-input w-full bg-slate-100 py-[.5rem] px-8 rounded-full outline-none text-center"
      />
    </div>
  );
}

export default Search