// Frameworks
import React, { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { Col, Row } from "react-bootstrap";

//Styles
import styles from "./SwiperMagazine.module.css";

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
import Magazine from "../../Magazine/Magazine";
SwiperCore.use([Autoplay, Pagination, Navigation]);

/**
 * Docs of swiperJS in
 * https://swiperjs.com/react
 */

const SwiperMagazine = (props) => {
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
        {items.map((magazine, index) => (
          <SwiperSlide key={index}>
            <div className="swiper-slide">
              <div className={styles.itemList}>
                <Magazine magazine={magazine}/>
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
export default SwiperMagazine;
