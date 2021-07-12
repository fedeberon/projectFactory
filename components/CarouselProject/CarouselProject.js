import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
  Button,
} from "reactstrap";
import ModalImage from "../ModalImage/ModalImage";
import CarouselProjectStyle from "./CarouselProject.module.css";

const CarouselProject = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [slides, setSlides] = useState([]);
  const [modalImage, showModalImage] = useState(false);
  const [selectImage, setSelectImage] = useState("");

  const { images, imageOpen, setAppliedFilters, setCurrentImageId} = props;

  const toggle = () => {
    showModalImage(!modalImage);
  };

  const verImagen = (event) => {
    setSelectImage(event.target.src);
    toggle();
  };

  useEffect(() => {
    if (images) {
      const imagesCarousel = images.map((item, index) => {
        return (
          <CarouselItem
            className={`${CarouselProjectStyle.height}`}
            onExiting={() => setAnimating(true)}
            onExited={() => setAnimating(false)}
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
            <CarouselCaption captionText={""} captionHeader={""} />
          </CarouselItem>
        );
      });

      setSlides(imagesCarousel);
    }
  }, [images]);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === images.length - 1 ? 0 : activeIndex + 1;
    console.log("next",images[nextIndex]);
    setCurrentImageId(images[nextIndex].id);
    setAppliedFilters(images[nextIndex].tags);
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? images.length - 1 : activeIndex - 1;
    setCurrentImageId(images[nextIndex].id);
    setAppliedFilters(images[nextIndex].tags);
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  return (
    <>
      <ModalImage
        toggle={toggle}
        isOpen={modalImage}
        selectImage={selectImage}
        className={"modal-fullscreen-xxl-down" + " bg-transparent"}
      />
      <Carousel activeIndex={activeIndex} next={next} previous={previous}>
        <CarouselIndicators
          items={slides}
          activeIndex={activeIndex}
          onClickHandler={goToIndex}
        />
        {slides}
        <CarouselControl
          direction="prev"
          directionText="Previous"
          onClickHandler={previous}
        />
        <CarouselControl
          direction="next"
          directionText="Next"
          onClickHandler={next}
        />
      </Carousel>
    </>
  );
};

export default CarouselProject;
