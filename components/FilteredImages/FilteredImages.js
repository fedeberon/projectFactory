import React, { useRef } from "react";
import useTranslation from "next-translate/useTranslation";
import {
  Card,
  CardBody,
  CardDeck,
  CardImg,
  CardText,
  Col,
  Row,
} from "reactstrap";
import filteredImagesStyles from "./FilteredImages.module.css";
import { Heart, HeartFill } from "react-bootstrap-icons";
import { useSession } from "next-auth/client";
import { setLikePhoto } from "../../services/imageService";

const FilteredImages = ({ isLoading, images }) => {
  const [session] = useSession();
  const refLikes = useRef([]);

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
      await setLikePhoto(image, session.accessToken);
      const heartsIco = image.div.children;
      if (image.liked) {
        heartsIco[0].style.display = "block";
        heartsIco[1].style.display = "none";
      } else {
        heartsIco[0].style.display = "none";
        heartsIco[1].style.display = "block";
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Row className="row-cols-1 row-cols-lg-2 row-cols-xl-3 g-4">
      {isLoading ? (
        <h1>{t("loading")}...</h1>
      ) : (
        images.map((image, index) => (
          <Col key={index}>
            <CardDeck className={`${filteredImagesStyles.colCard}`}>
              <Card>
                <CardBody className="p-0">
                  <CardImg
                    className={`${filteredImagesStyles.cardImage}`}
                    top
                    src={image.path}
                    alt="Professional preview"
                  />
                  <div className={`${filteredImagesStyles.cardText}`}>
                    <Col className="col-auto">
                      <img
                        className={`${filteredImagesStyles.imgProfile} rounded-circle`}
                        src={image.professional.previewImage}
                      />
                    </Col>
                    <Col className={`col-auto`}>
                      <CardText
                        className={`${filteredImagesStyles.textShadowSm} fw-bold`}
                      >
                        {`${image.professional.contact}`}
                      </CardText>
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
                </CardBody>
              </Card>
            </CardDeck>
          </Col>
        ))
      )}
    </Row>
  );
};

export default FilteredImages;
