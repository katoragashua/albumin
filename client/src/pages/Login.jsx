import React from "react";
import { Form, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((store) => store.auth);
  console.log(userInfo);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData);
    // login(userData)
    dispatch(loginUser(userData));
    navigate("/");
  };

  const login = async (data) => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("Success:", result);
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 justify-center py-16">
      <Form
        method="post"
        onSubmit={handleSubmit}
        className="flex flex-col justify-center p-8 gap-8 w-[80%] md:w-[70%] lg:w-[60%] xl:w-[60%] 2xl:w-[50%] rounded-md shadow-md"
      >
        <h3 className="self-center">Login</h3>
        <div className="flex flex-col">
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" id="email" className="inputs" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            className="inputs"
          />
        </div>

        <div className="forgot-password">
          <Link to="/forgot-password" id="forgot-password">
            Forgot password.
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
  );
};

export default Login;
