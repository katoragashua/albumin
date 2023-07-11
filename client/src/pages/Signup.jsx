import React from "react";
import { Form } from "react-router-dom";

const Signup = () => {
  return (
    <div>
      <div>
        <p>Already have an account?</p>
        <Link>Login</Link>
      </div>
      <Form method="post">
        <div className="flex-column">
          <label htmlFor="firstname">Firstname:</label>
          <input type="text" name="firstname" id="firstname" />
        </div>
        <div className="flex-column">
          <label htmlFor="lastname">Lastname:</label>
          <input type="text" name="lastname" id="lastname" />
        </div>
        <div className="flex-column">
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" id="email" />
        </div>
        <div className="flex-column">
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" id="password" />
        </div>
        <div className="flex-column">
          <label htmlFor="username">Username:</label>
          <input type="text" name="username" id="username" />
        </div>
        <button type="submit">Join</button>
      </Form>
    </div>
  );
};

export default Signup;
