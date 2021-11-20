import React, { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
import "swiper/swiper-bundle.css";
import styles from "./SwiperEmpresas.module.css";
import Link from "next/link";
import { Col, Row } from "react-bootstrap";

// Custom Hooks
import useSize from "../../../hooks/window/useSize";
import PrimaryButton from "../../Buttons/PrimaryButton/PrimaryButton";
/**
 * Docs of swiperJS in
 * https://swiperjs.com/react
 */

SwiperCore.use([Autoplay, Pagination, Navigation]);

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
    <div className="container">
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
                      href={`/companies/${company.name.replace(/\s+/g, "-").toLowerCase()}-${
                        company.id
                      }`}
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
                  <Col className={"d-flex justify-content-between"}>
                    <Col className={"col-auto m-2"}>
                      <div className={`${styles.blockAndWeight} fw-bold`}>
                        {company.contact}
                      </div>
                      {company.categories[0].name}
                    </Col>
                    <Col className={"col-auto m-2"}>
                      <Link
                        href={`/companies/${company.name.replace(
                          /\s+/g,
                          "-"
                        ).toLowerCase()}-${company.id}`}
                        passHref
                      >
                        <PrimaryButton>{t("common:view-more")}</PrimaryButton>
                      </Link>
                    </Col>
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
