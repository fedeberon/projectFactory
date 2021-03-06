// Frameworks
import React, { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { Col, Row } from "react-bootstrap";

//Styles
import styles from "./SwiperEmpresas.module.css";

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
SwiperCore.use([Autoplay, Pagination, Navigation]);

/**
 * Docs of swiperJS in
 * https://swiperjs.com/react
 */

const SwiperEmpresas = (props) => {
  const { t } = useTranslation("common");

  const {
    items,
    slidesPerViewMobile,
    slidesPerViewDesktop,
    slidesPerViewTablet,
  } = props;
  const { width } = useSize();
  const [slidesPerViewLocal, setSlidesPerViewLocal] = useState(0);

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
        {items.map((company, index) => (
          <SwiperSlide key={index}>
            <div className="swiper-slide">
              <div className={styles.itemList}>
                <Row className="row-cols-1">
                  <Col>
                    <Link
                      href={`/companies/${company.name
                        .replace(/\s+/g, "-")
                        .toLowerCase()}-${company.id}`}
                      passHref
                    >
                      <a className={styles.ancor}>
                        <Col>
                          <figure className={styles.figure}>
                            <img
                              width={350}
                              height={160}
                              src={company.backgroundImage}
                              className={styles.photo}
                            />
                          </figure>
                          <div className={styles.logo}>
                            <img
                              src={company.previewImage}
                              className={styles.photoPreview}
                            />
                          </div>
                        </Col>
                      </a>
                    </Link>
                  </Col>
                  {/* <Col className={"d-flex justify-content-between "}> */}
                  <Col>
                    <Row className={`justify-content-between ${styles.info}`}>
                      <Col
                        className={`col-5 col-sm-6 col-md-7 col-lg-6 col-xl-8`}
                      >
                        <strong
                          className={`${styles.blockAndWeight} ${styles.strong} ${styles.maxTextLength} fw-bold`}
                        >
                          {company.contact}
                        </strong>
                        <div
                          className={`${styles.name} ${styles.maxTextLength}`}
                        >
                          {company.categories[0].name}
                        </div>
                      </Col>
                      <Col
                        className={`col-auto col-sm-auto col-md-5 col-lg-6 col-xl-4`}
                      >
                        <Link
                          href={`/companies/${company.name
                            .replace(/\s+/g, "-")
                            .toLowerCase()}-${company.id}`}
                          passHref
                        >
                          <PrimaryButton>{t("common:view-more")}</PrimaryButton>
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
export default SwiperEmpresas;
