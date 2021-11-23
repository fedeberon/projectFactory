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
    blank,
    as,
    disabled,
  } = props;

  return (
    <Button
      as={as}
      href={href}
      onClick={onClick}
      ref={ref}
      className={`${styles.btnLg} ${
        outline
          ? `${styles.btnLightOutline} ${styles.btnLight}`
          : styles.btnLight
      }
      ${dark ? styles.btnDark : yellow ? styles.btnYellow : ""} 
      d-flex align-items-center justify-content-center gap-1
      ${className ? className : ""}
      ${disabled ? styles.btnDarkDisabled : ""}
      `}
      style={style}
      type={type}
      target={blank ? `_blank` : ``}
      disabled={disabled}
    >
      {children}
    </Button>
  );
});

export default PrimaryButton;
