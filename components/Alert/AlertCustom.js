import React from "react";
import { Alert } from "react-bootstrap";
import styles from "./AlertCustom.module.css";

const AlertCustom = (props) => {
  const { children, themeDark, className } = props;
  return (
    <Alert
      variant="primary"
      className={`d-flex justify-content-center gap-2 ${
        themeDark ? styles.themeDark : ``
      } ${className ? className : ``}`}
    >
      {children}
    </Alert>
  );
};

export default AlertCustom;
