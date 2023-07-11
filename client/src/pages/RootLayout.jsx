import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import Modal from "../components/Modal";

const RootLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Modal />
    </div>
  );
};

export default RootLayout;
