import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import useTranslation from "next-translate/useTranslation";
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
import styles from "./SwiperProducts.module.css";

// Custom Hooks
import useSize from "../../../hooks/window/useSize";
import PrimaryButton from "../../Buttons/PrimaryButton/PrimaryButton";
import Link from "next/link";
import { Col, Row } from "react-bootstrap";
/**
 * Docs of swiperJS in
 * https://swiperjs.com/react
 */

SwiperCore.use([Autoplay, Pagination, Navigation]);

const SwiperProducts = (props) => {
  const {
    products,
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

  const { t } = useTranslation("common");

  return (
    <>
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
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="swiper-slide">
                <div className={styles.productList}>
                  <a
                    href={`/product/${product?.name?.replace(/\s+/g, "-")}-${
                      product.id
                    }`}
                    className={styles.ancor}
                  >
                    <figure className={styles.figure}>
                      <img
                        src={product.previewImage}
                        className={styles.photo}
                      />
                    </figure>
                  </a>
                  <Row className="row-cols-1">
                    <Col>
                      <div
                        className={`${styles.name} ${styles.blockAndWeight}`}
                      >
                        <strong className={styles.blockAndWeight}>
                          {product?.name}
                        </strong>
                        {product?.company?.name}
                      </div>
                    </Col>
                    <Col className="col-auto">
                      <Link
                        href={`/product/${product?.name?.replace(/\s+/g, "-")}-${
                          product.id
                        }`}
                        passHref
                      >
                        <PrimaryButton href>{t("view-more")}</PrimaryButton>
                      </Link>
                    </Col>
                  </Row>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div
            className={`swiper-button-next ${styles.swiperButtonNext}`}
          ></div>
          <div
            className={`swiper-button-prev ${styles.swiperButtonPrev}`}
          ></div>
        </Swiper>
      </div>
    </>
  );
};

export default SwiperProducts;
