import React, { useState, useEffect } from "react";
import {
  Carousel
} from "react-bootstrap";
import CarouselBannerStyle from "./CarouselBanner.module.css";

const CarouselBanner = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [slides, setSlides] = useState([]);

  const { images } = props;
  
  useEffect(() => {
    if (images) {
      const imagesCarousel = images.map((item, index) => {
        return (
          // <Carousel.Item className={CarouselBannerStyle.carouselItem}
          //   onExiting={() => setAnimating(true)}
          //   onExited={() => setAnimating(false)}
          //   key={index}
          // >
          //   <a href={item.link}>
          //     <img
          //       className={CarouselBannerStyle.images}
          //       src={item.path}
          //       alt={item.title}
          //     />
          //   </a>
          //   <Carousel.Caption captionText={item.subTitle} captionHeader={item.title} />
          // </Carousel.Item>
        );
      });

      setSlides(imagesCarousel);
    }
  }, [images]);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === images.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? images.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  return (
    <Carousel activeIndex={activeIndex} next={next} previous={previous}>
      <Carousel.Indicators
        items={slides}
        activeIndex={activeIndex}
        onClickHandler={goToIndex}
      />
      {slides}
      <Carousel.Control
        direction="prev"
        directionText="Previous"
        onClickHandler={previous}
      />
      <Carousel.Control
        direction="next"
        directionText="Next"
        onClickHandler={next}
      />
    </Carousel>
  );
};

export default CarouselBanner;
