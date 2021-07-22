import React from "react";
import { Row, Col } from "react-bootstrap";
import useTranslation from "next-translate/useTranslation";
import PrimaryButton from "../Buttons/PrimaryButton/PrimaryButton";
import AboutHomeStyle from "./AboutHome.module.css";

const AboutHome = () => {
  const { t } = useTranslation("common");

  return (
    <div className={AboutHomeStyle.backgroundGray}>
      <Row className="row-cols-2">
        <Col className="col-12 col-md-6">
          <img className="w-100" src="./about.jpg"></img>
        </Col>
        <Col className="col-12 col-md-6 d-flex flex-column justify-content-center">
          <Col className="col-auto">
            <h2>{t("about-home.a-factory-of-ideas")}</h2>
          </Col>
          <Col className="col-auto">
            <p>{t("about-home.we-are-an-online-platform")}</p>
          </Col>
          <Col className="col-auto">
            <PrimaryButton href={"/about"} name={t("view-more")} />
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default AboutHome;
