import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import avatar from "../assets/images/account-circle-fill.svg";
import upload from "../assets/images/upload-2-line.svg";
import modalSlice from "../features/modal/modalSlice";
const {
  actions: { toggleLogin, toggleModal },
} = modalSlice;

export const LoggedIn = () => {
  return (
    <div className="logged-in">
      <div className="profile-thumb">
        <img src="" alt="profile photo thumbnail" className="thumb" />
      </div>
      <div className="notifications">
        <img src="" alt="notifications bell" className="notifications-bell" />
      </div>
    </div>
  );
};

const Nav = () => {
  const dispatch = useDispatch();

  return (
    <nav className="nav">
      <ul className="flex gap-8 items-center">
        <li>
          <NavLink className="navigation">Explore</NavLink>
        </li>
        <li>
          <NavLink className="navigation" to={"/login"}>Login</NavLink>
        </li>
        <li>
          <NavLink
            className="navigation"
            onClick={() => {
              dispatch(toggleLogin())
              dispatch(toggleModal());
            }}
          >
            <span className="btn flex gap-2 items-center text-[#970C10] border py-[.5rem] px-6  rounded-full">
              Upload
              <img src={upload} alt="upload icon" className="icons" />
            </span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
