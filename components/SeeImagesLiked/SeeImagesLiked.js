import React, { useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import ImageLiked from "./ImageLiked";
import useTranslation from "next-translate/useTranslation";

const SeeImagesLiked = ({ imagesLiked }) => {
  const { t } = useTranslation("profile");

  return (
    <Container>
      <h1>{t("images-i-liked")}</h1>
      <Row className="row-cols-1 row-cols-md-2 row-cols-lg-3 g-2">
        {imagesLiked.map((image) => (
          <Col key={image.id}>
            <ImageLiked image={image} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SeeImagesLiked;
