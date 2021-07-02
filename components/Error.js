import React from "react";
import { ExclamationTriangle } from "react-bootstrap-icons";

const Error = ({ error }) => {
  return (
    <div className="alert alert-danger m-0 align-items-center d-flex" role="alert">
      <ExclamationTriangle className="me-2" size={25} /> {error}
    </div>
  );
};

export default Error;
