import React from "react";
import { Card } from "react-bootstrap";
import Link from "next/link";
import styles from "./Magazine.module.css";
import PrimaryButton from "../Buttons/PrimaryButton/PrimaryButton";

const Magazine = (props) => {
  const { magazine } = props;
  return (
    <Link
      href={`/magazine/${magazine.title.replace(/\s+/g, "-").toLowerCase()}-${
        magazine.id
      }`}
    >
      <Card>
        <div className={styles.divImg}>
          <label className={styles.label}>{magazine.category}</label>
          <img
            className={`${styles.img} cursor-pointer`}
            src={magazine.previewImage}
            />
        </div>
          
        <Card.Body>
          <Card.Title>{magazine.title}</Card.Title>
          <Card.Text>{magazine.description}</Card.Text>
        </Card.Body>
        <Card.Footer className="bg-white">
          <Link
            href={`/magazine/${magazine.title.replace(/\s+/g, "-").toLowerCase()}-${
              magazine.id
            }`}
          >
            <PrimaryButton>Leer</PrimaryButton>
          </Link>
        </Card.Footer>
      </Card>
    </Link>
  );
};

export default Magazine;
