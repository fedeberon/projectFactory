import React, { useState, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import SpinnerCustom from "../../SpinnerCustom/SpinnerCustom";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";

//Styles
import styles from "./Professional.module.css";
import { GeoAlt, PersonCircle } from "react-bootstrap-icons";
import PrimaryButton from "../../Buttons/PrimaryButton/PrimaryButton";

// Hooks
import useSize from "../../../hooks/window/useSize";

const Professional = ({ isLoading, professional }) => {
  // const [professional, setProfessional] = useState(false);
  const { t } = useTranslation("common");

  const { width, height } = useSize();
  const [sizeIco, setSizeIco] = useState(176);

  useEffect(() => {
    if (width >= 1400) {
      setSizeIco(248);
    } else if (width >= 1200) {
      setSizeIco(212);
    } else if (width >= 992) {
      setSizeIco(265);
    } else if (width >= 768) {
      // Tablet 768px
      setSizeIco(402);
    } else if (width >= 576) {
      setSizeIco(294);
    } else if (width >= 425) {
      // Mobile L 425px
      setSizeIco(225);
    } else if (width >= 375) {
      // Mobile M 375px
      setSizeIco(195);
    } else if (width >= 320) {
      // Mobile S 320px
      setSizeIco(162);
    }
  }, [width]);

  return (
    <div className={`${styles.company}`}>
      <Row className="no-gutters">
        <Col sm={5} md={4} lg={5} className={styles.figure}>
          <figure>
            <Link
              href={`/professional/${professional.contact
                .replace(/\s+/g, "-")
                .toLowerCase()}-${professional.id}`}
            >
              <a>
                <div className={`${styles.deg} deg`}></div>
                <img
                  src={professional.backgroundImage}
                  className={styles.photo}
                />
              </a>
            </Link>
          </figure>
        </Col>
        <Col sm={7} md={5} lg={5} className={styles.info}>
          <div className={styles.logo}>
            {professional.previewImage ? (
              <img src={professional.previewImage} />
            ) : (
              <PersonCircle
              size={46}
              className={`${styles.ico}`}
            />
            )}
          </div>
          <div className={styles.m1}>
            <div className="name">
              <strong>{professional.contact}</strong>
              {professional.category.name}
            </div>
            <p>{professional.description}</p>
          </div>
        </Col>
        <Col sm={12} md={3} lg={2}>
          <div className={`${styles.boxdeg} boxdeg`}>
            <h5>
              <span className={`${styles.badge} badge`}>
                {professional.count}
              </span>{" "}
              {t("buildingWorks")}
            </h5>
            <div className="d-flex">
              <GeoAlt className={styles.locationIcon} />
              <div className={styles.location}>
                {professional.location}.{" "}
                {`${t("province-of")} ${professional.province}`}.
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <Link
                href={`/professional/${professional.contact
                  .replace(/\s+/g, "-")
                  .toLowerCase()}-${professional.id}`}
              >
                <PrimaryButton className="btn-sm">
                  {t("view-more")}
                </PrimaryButton>
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Professional;
