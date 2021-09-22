// Frameworks
import React, { useState, useEffect, useRef } from "react";
import useTranslation from "next-translate/useTranslation";
import { useSession } from "next-auth/client";
import Link from "next/link";
import Image from "next/image";
import { Card, Col, Row } from "react-bootstrap";
import {
  Heart,
  HeartFill,
  InfoCircleFill,
  PersonCircle,
} from "react-bootstrap-icons";
import InfiniteScroll from "react-infinite-scroll-component";

// Styles
import filteredImagesStyles from "./FilteredImages.module.css";

//Services
import * as imageService from "../../services/imageService";

//Components
import SpinnerCustom from "../SpinnerCustom/SpinnerCustom";
import AlertCustom from "../Alert/AlertCustom";

const FilteredImages = ({ images, disLiked, fetchMoreData, limit }) => {
  const [session] = useSession();
  const refLikes = useRef([]);
  const [hasMore, setHasMore] = useState(true);

  refLikes.current = [];

  const addLikes = (div, image) => {
    if (div && !refLikes.current.includes(div)) {
      div.setAttribute("name", image.id);
      image.setLike(div);
      refLikes.current.push(div);
    }
  };

  const { t } = useTranslation("common");

  const onLikeImage = async (image) => {
    try {
      await imageService.setLikePhoto(image, session.accessToken);
      const heartsIco = image.div.children;
      if (image.liked) {
        heartsIco[0].style.display = "block";
        heartsIco[1].style.display = "none";
      } else {
        if (disLiked != null) {
          await disLiked();
        }
        heartsIco[0].style.display = "none";
        heartsIco[1].style.display = "block";
      }
    } catch (error) {
      console.error(error);
    }
  };

  const shimmer = (w, h) => `
  <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#EAEAEA" offset="20%" />
        <stop stop-color="#FFFFFF" offset="50%" />
        <stop stop-color="#EAEAEA" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#EAEAEA" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
  </svg>`;

  const toBase64 = (str) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str);

  useEffect(() => {
    // setHasMore(
    //   !limit || (!images.length === 0 && images.length > 10) ? true : false
    // );
    setHasMore(images.length >= 10 ? true : false);
  }, [images]);

  return (
    <Row className="w-100 m-0">
      <Col>
        {images.length === 0 ? (
          <Col xs={12}>
            <AlertCustom themeDark>
              <InfoCircleFill size={25} />
              {`${t("table-admin.there-are-not-more")} `}
            </AlertCustom>
          </Col>
        ) : (
          <InfiniteScroll
            className="row row-cols-1 row-cols-lg-2 row-cols-xl-3 g-4 w-100 m-0"
            dataLength={images.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<SpinnerCustom className="w-100 m-0 my-2" />}
            endMessage={
              !limit && (
                <Col xs={12}>
                  <AlertCustom themeDark>
                    <InfoCircleFill size={25} />
                    {`${t("yay-You-have-seen-it-all")}`}
                  </AlertCustom>
                </Col>
              )
            }
          >
            {images.map((image, index) => (
              <Col key={index}>
                <Card className={`${filteredImagesStyles.colCard}`}>
                  <Card.Body
                    className={`${filteredImagesStyles.cardImage} p-0 `}
                  >
                    <Link
                      href={{
                        pathname: "/building/[id]",
                        query: { img: image.id },
                      }}
                      as={`/building/${image.buildingWork?.name
                        ?.replace(/\s+/g, "-")
                        .toLowerCase()}-${image.buildingWork?.id}?img=${
                        image.id
                      }`}
                      passHref
                    >
                      <a>
                        <Image
                          layout="fill"
                          objectFit="cover"
                          quality={50}
                          className={`cursor-pointer`}
                          src={image.path}
                          alt="Professional preview"
                          placeholder="blur"
                          blurDataURL={`data:image/svg+xml;base64,${toBase64(
                            shimmer(700, 475)
                          )}`}
                        />
                      </a>
                    </Link>
                    <div className={`${filteredImagesStyles.cardText}`}>
                      <Col className="col-auto">
                        {image.professional?.previewImage ? (
                          <img
                            className={`${filteredImagesStyles.imgProfile} rounded-circle`}
                            src={image.professional?.previewImage}
                          />
                        ) : (
                          <PersonCircle size={50} />
                        )}
                      </Col>
                      <Col className={`col-auto`}>
                        <Card.Text
                          className={`${filteredImagesStyles.textShadowSm} fw-bold`}
                        >
                          {`${image.professional?.contact}`}
                        </Card.Text>
                      </Col>
                      <Col
                        className={`col-auto ${filteredImagesStyles.containerHeart}`}
                      >
                        {session && (
                          <div
                            onClick={() => {
                              image.like(onLikeImage);
                            }}
                            ref={(div) => {
                              addLikes(div, image);
                            }}
                          >
                            <>
                              <HeartFill
                                className={`${filteredImagesStyles.heart}`}
                                style={{
                                  display: `${image.liked ? "block" : "none"}`,
                                }}
                                color={"white"}
                                size={25}
                              />
                            </>
                            <>
                              <Heart
                                className={`${filteredImagesStyles.heart}`}
                                style={{
                                  display: `${!image.liked ? "block" : "none"}`,
                                }}
                                color={"white"}
                                size={25}
                              />
                            </>
                          </div>
                        )}
                      </Col>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </InfiniteScroll>
        )}
      </Col>
    </Row>
  );
};

export default FilteredImages;
