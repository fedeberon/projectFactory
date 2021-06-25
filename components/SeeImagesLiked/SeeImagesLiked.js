import React from "react";
import { Row, Col, Container } from "reactstrap";
import ImageLiked from "./ImageLiked";
import useTranslation from "next-translate/useTranslation";

const SeeImagesLiked = ({ imagesLiked }) => {

  const { t } = useTranslation("profile");

  return (
    <Container>
      <h1>{t("images-i-liked")}</h1>
      <Row className="row-cols-3 g-2">
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
