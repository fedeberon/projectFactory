import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import useTranslation from "next-translate/useTranslation";
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
import styles from "./SwiperCarouselHome.module.css";
import "swiper/swiper-bundle.css";
import Link from "next/link";
import PrimaryButton from "../../Buttons/PrimaryButton/PrimaryButton";
/**
 * Docs of swiperJS in
 * https://swiperjs.com/react
 */

SwiperCore.use([Autoplay, Pagination, Navigation]);

const SwiperCarouselHome = (props) => {
  const { images } = props;
  const { t } = useTranslation("common");
  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      loop={true}
      navigation={{
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      }}
      className={`${styles.swiper}`}
    >
      {images.map((image) => (
        <SwiperSlide key={image.id} className={`${styles.swiperSlile}`}>
          <div className={`slide-captions ${styles.slideCaptions}`}>
            <div className={styles.text}>
              <h3 className={`${styles.tit}`}>{image.title}</h3>
              <p className={`${styles.description} `}>{image.subTitle}</p>
              <Link href={image.link}>
                <PrimaryButton outline>{t("view-more")}</PrimaryButton>
              </Link>
            </div>
          </div>
          <img className={styles.img} src={image.path} alt={image.title} />
        </SwiperSlide>
      ))}
      <div className={`swiper-button-next ${styles.swiperButtonNext}`}></div>
      <div className={`swiper-button-prev ${styles.swiperButtonPrev}`}></div>
    </Swiper>
  );
};

export default SwiperCarouselHome;
