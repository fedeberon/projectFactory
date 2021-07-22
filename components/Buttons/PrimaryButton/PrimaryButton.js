import React from "react";
import Link from "next/link";
import PrimaryButtonStyles from "./PrimaryButton.module.css";

const PrimaryButton = (props) => {
  const { href, name, className } = props;
  return (
    <Link href={href}>
      <a
        className={`${PrimaryButtonStyles.btnLight} ${PrimaryButtonStyles.btnLg} ${className ? className : ""}`}
      >
        {name}
      </a>
    </Link>
  );
};

export default PrimaryButton;
