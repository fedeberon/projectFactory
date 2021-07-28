import React, { useState, useEffect } from "react";
import { Carousel, Button, Modal } from "react-bootstrap";
import ModalImage from "../../ModalImage/ModalImage";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./SwiperCarouselProject.module.css";
import SwiperCore, {
  Autoplay,
  Pagination,
  Navigation,
  Controller,
} from "swiper";
import * as imageService from "../../../services/imageService";
import "swiper/swiper-bundle.css";
SwiperCore.use([Autoplay, Pagination, Navigation, Controller]);

const SwiperCarouselProject = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [slides, setSlides] = useState([]);
  const [modalImage, showModalImage] = useState(false);
  const [selectImage, setSelectImage] = useState("");
  const [swiper, setSwiper] = useState(null);

  const { images, imageOpen, setAppliedFilters, setCurrentImageId, reset } =
    props;

  const toggle = () => {
    showModalImage(!modalImage);
  };

  const verImagen = (imagen) => {
    setSelectImage(imagen.src);
    toggle();
  };

  useEffect(() => {
    if (images) {
      const imagesCarousel = images.map((item, index) => {
        return (
          <Carousel.Item className={`${styles.height}`} key={index}>
            <img
              className={`${styles.img}`}
              src={item.path}
              alt={item.name}
              onClick={(event) => {
                verImagen(event);
              }}
            />
          </Carousel.Item>
        );
      });

      setSlides(imagesCarousel);
    }
  }, [images]);

  const handleSlideChange = (slide) => {
    const image = images[slide.activeIndex];
    if (image != undefined) {
      setCurrentImage(image);
    }
  };

  const onSwiper = (slide) => {
    setSwiper(slide);
    handleSlideChange(slide);
  };

  useEffect(() => {
    resetSwiper();
  }, [reset]);

  const resetSwiper = () => {
    if (swiper) {
      swiper.controller.control.setTranslate(0);
    }
  };

  const setCurrentImage = (image) => {
    setCurrentImageId(image.id);
    setAppliedFilters(image.tags);
    if (!image.seen) imageService.increaseVisit(image);
  };

  return (
    <>
      <ModalImage
        toggle={toggle}
        show={modalImage}
        selectImage={selectImage}
        onHide={() => showModalImage(false)}
        className={`${styles.img}`}
      />

      <Swiper
        className={styles.swiperContainer}
        spaceBetween={0}
        slidesPerView={1}
        loop={false}
        onSlideChange={(slide) => handleSlideChange(slide)}
        onSwiper={(slide) => onSwiper(slide)}
        controller={{ control: swiper }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        pagination={{
          el: ".swiper-pagination",
          type: "fraction",
          clickable: true,
        }}
      >
        {images.map((image) => (
          <SwiperSlide
            onClick={(event) => verImagen(event.target)}
            key={image.id}
          >
            <img
              className={`${styles.img}`}
              name={image.id}
              src={image.path}
              alt={image.name}
            />
          </SwiperSlide>
        ))}
        <div className={`swiper-button-next ${styles.swiperButtonNext}`}></div>
        <div className={`swiper-button-prev ${styles.swiperButtonPrev}`}></div>
        <div className={`swiper-pagination ${styles.pagination}`}></div>
      </Swiper>
    </>
  );
};

export default SwiperCarouselProject;
