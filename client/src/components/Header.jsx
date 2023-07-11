import React from "react";
import Nav from "./Nav";
import Search from "./Search";
import logo from "../assets/images/1.svg";
import logo1 from "../assets/images/albumin1.svg";
import { Link } from "react-router-dom";


const Header = () => {
  return (
    <header className="header sticky my-0 z-[999] shadow-md">
      <div className="container flex justify-between items-center gap-16 pt-2">
        <div>
          <Link to={"/"} className="max-w-max">
            <h2>
              <img
                src={logo}
                alt="albumin logo"
                className="logo object-cover "
              />
            </h2>
          </Link>
        </div>
        <Search />
        <Nav />
      </div>
    </header>
  );
};

export default Header;
