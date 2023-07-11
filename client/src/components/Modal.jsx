import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Link } from "react-router-dom";
import modalSlice from "../features/modal/modalSlice";
import close from "../assets/images/close-line.svg";
const {
  actions: { toggleModal, toggleLogin, toggleSignup, toggleDownload },
} = modalSlice;
import { registerUser } from "../features/auth/authSlice";

const Modal = () => {
  const dispatch = useDispatch();
  const { isShown, login, signup, download } = useSelector(
    (store) => store.modal
  );
  const modalRef = useRef(null);

  const showModal = () => {
    if (isShown) modalRef.current.showModal();
    if (!isShown) modalRef.current.close();
  };

  useEffect(() => {
    showModal();
  }, [isShown]);

  // const getFormData = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.target);
  //   const entries = Object.fromEntries(formData);
  //   console.log(entries);
  //   return entries;
  //   // const userData = await register(entries);
  // };

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData)
    dispatch(registerUser(userData))
  };

  // const register = async (data) => {
  //   try {
  //     const response = await fetch("http://localhost:5000/api/v1/auth/register", {
  //       method: "POST", // or 'PUT'
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     });
  //     const result = await response.json();
  //     console.log("Success:", result);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  return (
    <dialog
      method="dialog"
      ref={modalRef}
      className="w-3/4 md:w-1/2 lg:w-1/2 xl:w-1/2 2xl:w-1/2 relative py-16 px-8 bg-white rounded-md outline-none "
    >
      <div className="flex justify-center items-center gap-4">
        <h3 className="text-center font-bold p-2">Login</h3>
        <h3
          className="text-center font-bold p-2"
          onClick={() => {
            dispatch(toggleSignup());
            dispatch(toggleLogin());
          }}
        >
          Signup
        </h3>
      </div>
      <div
        className="close-modal hover:pointer-events-auto absolute top-4 right-4"
        onClick={() => {
          dispatch(toggleModal());
        }}
      >
        <img src={close} alt="close icon" />
      </div>

      {login && (
        <div>
          <Form
            method="post"
            onSubmit={handleSubmit}
            className="flex flex-col"
          >
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              className="mb-8 rounded-md outline-none px-4 py-2 bg-slate-100"
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              className="mb-8 rounded-md outline-none px-4 py-2 bg-slate-100"
            />
            <div className="forgot-password mb-2">
              <Link to="/forgot-password" id="forgot-password">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className="bg-[#970C10] px-[2.5rem] py-[.5rem] rounded-md text-slate-100 self-center"
            >
              Login
            </button>
          </Form>
        </div>
      )}

      {signup && (
        <div>
          <Form
            method="post"
            onSubmit={handleSubmit}
            className="flex flex-col"
          >
            <label htmlFor="firstname">Firstname:</label>
            <input
              type="firstname"
              name="firstname"
              id="firstname"
              className="mb-8 rounded-md outline-none px-4 py-2 bg-slate-100"
            />
            <label htmlFor="lastname">Lastname:</label>
            <input
              type="lastname"
              name="lastname"
              id="lastname"
              className="mb-8 rounded-md outline-none px-4 py-2 bg-slate-100"
            />
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              className="mb-8 rounded-md outline-none px-4 py-2 bg-slate-100"
            />
            <label htmlFor="username">Username:</label>
            <input
              type="username"
              name="username"
              id="username"
              className="mb-8 rounded-md outline-none px-4 py-2 bg-slate-100"
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              className="mb-8 rounded-md outline-none px-4 py-2 bg-slate-100"
            />
            <button
              type="submit"
              className="bg-[#970C10] px-[2.5rem] py-[.5rem] rounded-md text-slate-100 self-center"
            >
              Join
            </button>
          </Form>
        </div>
      )}
      {download && (
        <div className="download">
          <h1>Download Photo.</h1>
        </div>
      )}
    </dialog>
  );
};

export default Modal;
