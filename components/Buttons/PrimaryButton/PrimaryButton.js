import React, { forwardRef } from "react";
import { Button } from "react-bootstrap";
import styles from "./PrimaryButton.module.css";

const PrimaryButton = forwardRef((props, ref) => {
  const {
    className,
    children,
    onClick,
    href,
    outline,
    dark,
    yellow,
    style,
    type,
  } = props;

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
      ${dark ? styles.btnDark : yellow ? styles.btnYellow : ""} 
      d-flex align-items-center justify-content-center gap-1
      ${className ? className : ""}
      `}
      style={style}
      type={type}
    >
      {children}
    </Button>
  );
});

export default PrimaryButton;
