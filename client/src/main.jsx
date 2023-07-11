import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import RootLayout from "./pages/RootLayout.jsx";
import Home from "./pages/Home";
import { loader as photosLoader } from "./pages/Home";
import Error from "./pages/Error";
import { store } from "./app/store";
import { Provider } from "react-redux";
import Login from "./pages/Login";

console.log(store);
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route
        index
        element={<Home />}
        loader={photosLoader}
        errorElement={<Error />}
      />
      <Route path="login" element={<Login />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
