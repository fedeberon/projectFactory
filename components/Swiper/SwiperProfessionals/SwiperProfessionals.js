// Frameworks
import React, { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { Col, Row } from "react-bootstrap";

//Styles
import styles from "./SwiperProfessionals.module.css";

// swiper bundle styles
import "swiper/css/bundle";

// modules styles
import "swiper/css/navigation";
import "swiper/css/pagination";

// Custom Hooks
import useSize from "../../../hooks/window/useSize";

// Components
import PrimaryButton from "../../Buttons/PrimaryButton/PrimaryButton";

// Modules
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
import { PersonCircle } from "react-bootstrap-icons";
SwiperCore.use([Autoplay, Pagination, Navigation]);

/**
 * Docs of swiperJS in
 * https://swiperjs.com/react
 */

const SwiperProfessionals = (props) => {
  const { t } = useTranslation("common");
  const {
    items,
    slidesPerViewMobile,
    slidesPerViewDesktop,
    slidesPerViewTablet,
  } = props;
  const { width } = useSize();
  const [slidesPerViewLocal, setSlidesPerViewLocal] = useState(0);
  // const [showPoints, setShowPoints] = useState(false);

  useEffect(() => {
    if (slidesPerViewMobile.dimensionLimit <= width) {
      setSlidesPerViewLocal(slidesPerViewMobile.slides);
    }
    if (slidesPerViewTablet.dimensionLimit <= width) {
      setSlidesPerViewLocal(slidesPerViewTablet.slides);
    }
    if (slidesPerViewDesktop.dimensionLimit <= width) {
      setSlidesPerViewLocal(slidesPerViewDesktop.slides);
    }
    // if (width <= 1024) {
    //   setShowPoints(true);
    // }
  }, [width]);

  return (
    <div className={`container ${styles.body}`}>
      <Swiper
        spaceBetween={30}
        slidesPerView={slidesPerViewLocal}
        loop={true}
        autoplay={{ delay: 3000 }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
      >
        {items.map((professional, index) => (
          <SwiperSlide key={index}>
            <div className="swiper-slide">
              <div className={styles.itemList}>
                <Row className="row-cols-1">
                  <Col>
                    <Link
                      href={`/professional/${professional.contact
                        .replace(/\s+/g, "-")
                        .toLowerCase()}-${professional.id}`}
                      passHref
                    >
                      <a className={styles.ancor}>
                        <Col>
                          <figure className={styles.figure}>
                            <img
                              width={350}
                              height={160}
                              src={professional.backgroundImage}
                              className={styles.photo}
                            />
                          </figure>
                          <div className={styles.logo}>
                            {professional.previewImage ? (
                              <img
                                src={professional.previewImage}
                                className={styles.photoPreview}
                              />
                            ) : (
                              <PersonCircle
                                size={46}
                                className={`${styles.ico}`}
                              />
                            )}
                            {/* <img
                              src={professional.previewImage}
                              className={styles.photoPreview}
                            /> */}
                          </div>
                        </Col>
                      </a>
                    </Link>
                  </Col>
                  {/* <Col className={"d-flex justify-content-between"}> */}
                  <Col>
                    <Row className={`justify-content-between ${styles.info}`}>
                      {/* <Col className={"col-6"}> */}
                      <Col
                        className={`col-5 col-sm-6 col-md-7 col-lg-6 col-xl-8`}
                      >
                        <strong
                          className={`${styles.blockAndWeight} ${styles.strong} ${styles.maxTextLength} fw-bold`}
                        >
                          {professional.contact}
                        </strong>
                        <div
                          className={`${styles.name} ${styles.maxTextLength}`}
                        >
                          {professional.category.name}
                        </div>
                      </Col>
                      {/* <Col className={"col-auto"}> */}
                      <Col
                        className={`col-7 col-sm-6 col-md-5 col-lg-6 col-xl-4`}
                      >
                        <Link
                          href={`/professional/${professional.contact
                            .replace(/\s+/g, "-")
                            .toLowerCase()}-${professional.id}`}
                          passHref
                        >
                          <PrimaryButton
                            style={{
                              "max-width": "100px",
                              "margin-left": "auto",
                            }}
                          >
                            {t("common:view-more")}
                          </PrimaryButton>
                        </Link>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <div className={`swiper-button-next ${styles.swiperButtonNext}`}></div>
        <div className={`swiper-button-prev ${styles.swiperButtonPrev}`}></div>
      </Swiper>
    </div>
  );
};
export default SwiperProfessionals;
