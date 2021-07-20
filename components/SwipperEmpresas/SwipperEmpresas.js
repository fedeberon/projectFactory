import React from "react";
import useTranslation from "next-translate/useTranslation";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
import "swiper/swiper-bundle.css";
import styles from "./SwipperEmpresas.module.css";
import Link from "next/link";
import { Col, Row } from "react-bootstrap";
/**
 * Docs of swiperJS in
 * https://swiperjs.com/react
 */

SwiperCore.use([Autoplay, Pagination, Navigation]);

const SwipperEmpresas = (props) => {
  const { items } = props;
  const { t } = useTranslation("common");

  return (
    <div className="container">
      <Swiper
        spaceBetween={30}
        slidesPerView={4}
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
                <Link
                  // href={`/professional/${professional.name.replace(/\s+/g, "-")}-${professional.id}`}
                  href={"/"}
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
                      <img
                        src={company.previewImage}
                        className={styles.photoPreview}
                      />
                    </Col>
                    <Col className={"col-12"}>
                      <Row>
                        <Col className={"col-6"}>
                          <div
                            className={`${styles.blockAndWeight} fw-bold`}
                          >
                            {company.contact}
                          </div>
                          {company.categories[0].name}
                        </Col>
                        <Col className={"col-6 d-flex justify-content-end"}>
                          <div
                            className={`btn btn-lg btn-light ${styles.btn}`}
                          >
                            {t("common:view-more")}
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </a>
                </Link>
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
export default SwipperEmpresas;
