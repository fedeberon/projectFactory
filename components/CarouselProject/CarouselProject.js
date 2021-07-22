import React, { useState, useEffect } from "react";
import {
  Carousel,
  Button,
  Modal,
} from "react-bootstrap";
import ModalImage from "../ModalImage/ModalImage";
import { Swiper, SwiperSlide } from 'swiper/react';
import CarouselProjectStyle from "./CarouselProject.module.css";
import SwiperCore, { Autoplay, Pagination, Navigation } from 'swiper';
import * as imageService from "../../services/imageService";
import "swiper/swiper-bundle.css";
SwiperCore.use([Autoplay, Pagination, Navigation])

const CarouselProject = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [slides, setSlides] = useState([]);
  const [modalImage, showModalImage] = useState(false);
  const [selectImage, setSelectImage] = useState("");

  const { images, imageOpen, setAppliedFilters, setCurrentImageId } = props;

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
          <Carousel.Item
            className={`${CarouselProjectStyle.height}`}
            key={index}
          >
            <img
              className={`${CarouselProjectStyle.img}`}
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

  const setCurrentImage = (image) => {
    setCurrentImageId(image.id);
    setAppliedFilters(image.tags);
    if (!image.seen)
      imageService.increaseVisit(image);
  };

  return (
    <>
      <ModalImage
        toggle={toggle}
        show={modalImage}
        selectImage={selectImage}
        onHide={() => showModalImage(false)}
        className={`${CarouselProjectStyle.img}`}
      />

    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      loop={false}
      onSlideChange={(slide) => handleSlideChange(slide)}
      onSwiper={(slide) => handleSlideChange(slide)}
      navigation={{
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      }}>
        {images.map(image => 
        <SwiperSlide
          className={`${CarouselProjectStyle.height}`}
          onClick={(event) => verImagen(event.target)}
          key={image.id}
        >
          <img
            className={`${CarouselProjectStyle.img}`}
            name={image.id}
            src={image.path}
            alt={image.name}
          />
        </SwiperSlide>
        )}
        <div className={`swiper-button-next`}></div>
        <div className={`swiper-button-prev`}></div>
    </Swiper>
    </>
  );
};

export default CarouselProject;
