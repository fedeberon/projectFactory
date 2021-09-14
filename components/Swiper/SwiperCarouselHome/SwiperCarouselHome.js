// Frameworks
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { Check, Trash } from "react-bootstrap-icons";
import { useSession } from "next-auth/client";
// Styles
import styles from "./SwiperCarouselHome.module.css";

// swiper bundle styles
import "swiper/css/bundle";

// modules styles
import "swiper/css/navigation";
import "swiper/css/pagination";

// Components
import PrimaryButton from "../../Buttons/PrimaryButton/PrimaryButton";

// Modules
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
import ModalButton from "../../Buttons/ModalButton/ModalButton";
SwiperCore.use([Autoplay, Pagination, Navigation]);

/**
 * Docs of swiperJS in
 * https://swiperjs.com/react
 */

const SwiperCarouselHome = (props) => {
  const { images, onDeleteCarouselImage } = props;
  const [session] = useSession();
  const { t } = useTranslation("common");

  /**
   * Generated URL-Link private or public when
   * click in the view more button, and generate
   * new window if it is a public URL, for example https://google.com
   * @param {String} link needed for create linked
   * @returns render component
   */
  const generateLink = (link) => {
    return link.includes("www") &&
      link.includes("https://") &&
      link.length > 0 ? (
      <Link href={`${link}`} passHref>
        <PrimaryButton as={"a"} blank outline style={{ width: "100px" }}>
          {t("view-more")}
        </PrimaryButton>
      </Link>
    ) : (
      link.length > 0 && (
        <Link href={`${link}`}>
          <PrimaryButton outline>{t("view-more")}</PrimaryButton>
        </Link>
      )
    );
  };

  const isRole = (role) => {
    if (session) {
      return session.authorities.includes(role);
    }
  };

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
              {generateLink(image.link)}
            </div>
          </div>
          <img className={styles.img} src={image.path} alt={image.title} />

          {isRole("ROLE_ADMINISTRATOR") && (
            <ModalButton
              buttonProps={{
                dark: true,
                children: (
                  <>
                    <Trash size={25} /> {t("delete")}
                  </>
                ),
              }}
              modalTitle={t(`are-you-sure`)}
              modalBody={
                <>
                  <h5>
                    {t("once-delete-you-will-not-be-able-to-recover-the-image")}
                  </h5>
                  <PrimaryButton
                    className={`m-2`}
                    type="button"
                    onClick={() => onDeleteCarouselImage(image.id)}
                  >
                    <Check size={25} /> {t("yes-i-want-to-eliminate")}
                  </PrimaryButton>
                </>
              }
            />
          )}
        </SwiperSlide>
      ))}
      <div className={`swiper-button-next ${styles.swiperButtonNext}`}></div>
      <div className={`swiper-button-prev ${styles.swiperButtonPrev}`}></div>
    </Swiper>
  );
};

export default SwiperCarouselHome;
