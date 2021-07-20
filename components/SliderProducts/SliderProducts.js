import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import useTranslation from "next-translate/useTranslation";
import SwiperCore, { Autoplay, Pagination, Navigation } from 'swiper';
import styles from "./SliderProducts.module.css";
/**
 * Docs of swiperJS in
 * https://swiperjs.com/react
 */

SwiperCore.use([Autoplay, Pagination, Navigation])

const SlederProducts = (props) => {
    const { products } = props;
    const { t } = useTranslation("common");

    return (<>
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
    {products.map(product => (
      <SwiperSlide key={product.id}>
        <div className="swiper-slide">
            <div className={styles.productList}>
                <a href={`/product/${product.name.replace(/\s+/g, "-")}-${product.id}`} className={styles.ancor}>
                    <figure className={styles.figure}><img src={product.previewImage} className={styles.photo}/></figure>
                    <div className={`${styles.info} ${styles.blockAndWeight}`}>
                        <div className={`${styles.name} ${styles.blockAndWeight}`}><strong className={styles.blockAndWeight}>{product.name}</strong>{product.company.name}</div>
                        <div className={`btn btn-lg btn-light ${styles.btn}`}>{t("view-more")}</div>
                    </div>
                </a>
            </div>
        </div>
      </SwiperSlide>
    ))}
    <div className={`swiper-button-next ${styles.swiperButtonNext}`}></div>
    <div className={`swiper-button-prev ${styles.swiperButtonPrev}`}></div>
    </Swiper>
        
</div>
    </>);
};

export default SlederProducts;