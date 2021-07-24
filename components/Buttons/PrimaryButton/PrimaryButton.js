import React, { forwardRef } from "react";
import { Button } from "react-bootstrap";
import styles from "./PrimaryButton.module.css";

const PrimaryButton = forwardRef((props, ref) => {
  const { className, children, onClick, href, outline } = props;

  return (
    <Button
      href={href}
      onClick={onClick}
      ref={ref}
      className={`${
        outline
          ? `${styles.btnLightOutline} ${styles.btnLight}`
          : styles.btnLight
      } 
      d-flex align-items-center gap-1
      ${className ? className : ""}
      `}
    >
      {children}
    </Button>
  );
});

export default PrimaryButton;
