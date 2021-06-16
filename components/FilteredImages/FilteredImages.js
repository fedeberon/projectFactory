import React from "react";
import { useTranslation } from "react-i18next";
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

const FilteredImages = ({ isLoading, images }) => {
  const { t, lang } = useTranslation("common");

  return (
    <Row className="row-cols-1 row-cols-lg-2 row-cols-xl-3 g-4">
      {isLoading ? (
        <h1>{t("Loading")}...</h1>
      ) : (
        images.map((image, index) => (
          <Col key={index}>
            <CardDeck>
              <Card>
                <CardImg
                  className="img-fluid"
                  top
                  src={image.path}
                  alt="Professional preview"
                />
                <CardBody>
                  <CardText>
                    {`${image.entity.contact}`}
                  </CardText>
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
