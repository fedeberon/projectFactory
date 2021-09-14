import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import useTranslation from "next-translate/useTranslation";
import PrimaryButton from "../Buttons/PrimaryButton/PrimaryButton";
import styles from "./AboutHome.module.css";
import Link from "next/link";

const AboutHome = () => {
  const { t } = useTranslation("common");

  return (
    <section className={`container-xl-fluid ${styles.backgroundGray} ${styles.aboutHome}`}>
      <Row className="row-cols-1 w-100 m-0">
        <Col className="col-12 col-md-6 p-0">
          <img className="w-100" src="./about.jpg"></img>
        </Col>
        <Col className="col-12 col-md-6">
          <Row className="row-cols-1 align-content-center justify-content-center h-100 w-100 m-0 py-2">
            <Col className="col-10">
              <h2>{t("about-home.a-factory-of-ideas")}</h2>
            </Col>
            <Col className="col-10">
              <p>{t("about-home.we-are-an-online-platform")}</p>
            </Col>
            <Col className="col-10">
              <Link href={"/about"}>
                <PrimaryButton>{t("view-more")}</PrimaryButton>
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </section>
  );
};

export default AboutHome;
