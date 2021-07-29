import React from "react";
import { Card } from "react-bootstrap";
import Link from "next/link";
import styles from "./CardProject.module.css";

const CardProject = (props) => {
  const { project } = props;
  return (
    <Link
      href={`/project/${project.name.replace(/\s+/g, "-").toLowerCase()}-${
        project.id
      }`}
    >
      <Card>
        <img className={`${styles.img} cursor-pointer`} src={project.previewImage} />
        <Card.Body>
          <Card.Title>{project.name}</Card.Title>
          <Card.Text>{project.description}</Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default CardProject;
