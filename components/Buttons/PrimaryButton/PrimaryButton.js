import React from "react";
import PrimaryButtonStyles from "./PrimaryButton.module.css";
import { Button } from "react-bootstrap";

const PrimaryButton = (props) => {
  const { className, children, onClick } = props;
  return (
    <Button
      onClick={onClick}
      className={`${PrimaryButtonStyles.btnLight} ${className ? className : ""}`}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;