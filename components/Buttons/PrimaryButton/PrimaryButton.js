import React from "react";
import Link from "next/link";
import PrimaryButtonStyles from "./PrimaryButton.module.css";

const PrimaryButton = ({ href, name }) => {
  return (
    <Link href={href}>
      <a
        className={`${PrimaryButtonStyles.btnLight} ${PrimaryButtonStyles.btnLg}`}
      >
        {name}
      </a>
    </Link>
  );
};

export default PrimaryButton;
