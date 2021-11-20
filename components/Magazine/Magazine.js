import React from "react";
import { Card } from "react-bootstrap";
import Link from "next/link";
import styles from "./Magazine.module.css";
import PrimaryButton from "../Buttons/PrimaryButton/PrimaryButton";
import useTranslation from "next-translate/useTranslation";

const Magazine = (props) => {
  const { magazine, description } = props;

  const { t } = useTranslation("common");

  return (
    <Link
      href={`/magazine/${magazine.title.replace(/\s+/g, "-").toLowerCase()}-${
        magazine.id
      }`}
    >
      <div className={`${styles.magList} border-0`}>
        <div className={styles.divImg}>
          <label className={styles.label}>{magazine.category.name}</label>
          <img
            className={`${styles.img} cursor-pointer`}
            src={magazine.previewImage}
          />
        </div>

        <div className={`${styles.info}`}>
          <h3 className={`${styles.name}`}>{magazine.title}</h3>
          {description && (
            <p className={`${styles.p}`}>{magazine.description}</p>
          )}
        </div>
        <div>
          <Link
            href={`/magazine/${magazine.title
              .replace(/\s+/g, "-")
              .toLowerCase()}-${magazine.id}`}
          >
            <PrimaryButton>{t("read")}</PrimaryButton>
          </Link>
        </div>
      </div>
    </Link>
  );
};

export default Magazine;
