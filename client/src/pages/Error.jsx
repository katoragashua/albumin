import React from "react";
import {useRouteError} from "react-router-dom"

const Error = () => {
    const error = useRouteError()
  return (
    <div className="text-center flex items-center justify-center h-[50vh]">
      <p className="mx-0 my-auto px-8 py-4 bg-slate-100 rounded-md font-semibold">{error.message}</p>
    </div>
  );
};

export default Error;
