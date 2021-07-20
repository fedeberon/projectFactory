import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import useTranslation from "next-translate/useTranslation";
import SwiperCore, { Autoplay, Pagination, Navigation } from 'swiper';
import styles from "./CarouselHome.module.css";
import "swiper/swiper-bundle.css";
/**
 * Docs of swiperJS in
 * https://swiperjs.com/react
 */

SwiperCore.use([Autoplay, Pagination, Navigation])

const CarouselHome = (props) => {
    const { images } = props;
    const { t } = useTranslation("common");
    return (
    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      loop={true}
      navigation={{
        nextEl: ".swiper-fullhome-next",
        prevEl: ".swiper-fullhome-prev",
      }}>
        {images.map(image => 
        <SwiperSlide key={image.id}>
            <div className={`slide-captions ${styles.slideCaptions}`}>
                <div className={styles.text}>
                    <h3 className={styles.tit}>{image.title}</h3>
                    <p className={styles.description}>{image.subTitle}</p>
                    <a href={image.link} className={styles.btnViewMore}>{t("view-more")}</a>
                </div>
            </div>
            <img src={image.path} alt={image.title}/>
        </SwiperSlide>
        )}
        <div className={`swiper-button-next swiper-fullhome-next ${styles.swiperButtonNext}`}></div>
        <div className={`swiper-button-prev swiper-fullhome-prev ${styles.swiperButtonPrev}`}></div>
    </Swiper>
    );
};

export default CarouselHome;