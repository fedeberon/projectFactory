import React from "react";
import styles from "./Company.module.css";
import Link from "next/link";
import { Col, Row } from "react-bootstrap";

const Company = (props) => {
  const { company } = props;

  return (
    <Row className="row-cols-2">
      <Col className="col-md-6 col-12">
        <Link href={`/companies/${company.name}-${company.id}`}>
          <img className={styles.img} src={company?.previewImage} />
        </Link>
      </Col>
      <Col className="col-md-6 col-12">
        <Row className="align-items-center h-100">
          <Col>
            <h3>{company.name}</h3>
            <p>{company.description}</p>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Company;
