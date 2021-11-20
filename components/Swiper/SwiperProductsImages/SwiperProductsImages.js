import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import useTranslation from "next-translate/useTranslation";
import SwiperCore, { Autoplay, Pagination, Navigation, Zoom } from "swiper";
import "swiper/swiper-bundle.css";
import "swiper/swiper.min.css";
import "swiper/components/zoom/zoom.min.css";
import styles from "./SwiperProductsImages.module.css";

// Custom Hooks
import useSize from "../../../hooks/window/useSize";
/**
 * Docs of swiperJS in
 * https://swiperjs.com/react
 */

SwiperCore.use([Autoplay, Pagination, Navigation, Zoom]);

const SwiperProductsImages = (props) => {
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
          style={{
            "--swiper-navigation-color": "#fff",
            "--swiper-pagination-color": "#fff",
          }}
          pagination={{
            el: ".swiper-pagination",
            type: "fraction",
            clickable: true,
          }}
          zoom={true}
          className="mySwiper"
          spaceBetween={30}
          slidesPerView={slidesPerViewLocal}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="swiper-zoom-container">
                <img src={product.path} className={styles.photo} />
              </div>
            </SwiperSlide>
          ))}
          <div
            className={`swiper-button-next ${styles.swiperButtonNext}`}
          ></div>
          <div
            className={`swiper-button-prev ${styles.swiperButtonPrev}`}
          ></div>
          <div className={`swiper-pagination ${styles.pagination}`}></div>
        </Swiper>
      </div>
    </>
  );
};

export default SwiperProductsImages;
