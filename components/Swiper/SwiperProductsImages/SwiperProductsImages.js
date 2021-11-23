// Frameworks
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import useTranslation from "next-translate/useTranslation";

// Styles
import styles from "./SwiperProductsImages.module.css";

// swiper bundle styles
import "swiper/css/bundle";

// modules styles
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";

// import "swiper/swiper.min.css";
// import "swiper/components/zoom/zoom.min.css";

// Custom Hooks
import useSize from "../../../hooks/window/useSize";

// Modules
import SwiperCore, { Autoplay, Pagination, Navigation, Zoom } from "swiper";
SwiperCore.use([Autoplay, Pagination, Navigation, Zoom]);

/**
 * Docs of swiperJS in
 * https://swiperjs.com/react
 */

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
