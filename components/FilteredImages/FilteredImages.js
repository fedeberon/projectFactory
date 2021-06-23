import React from "react";
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

const FilteredImages = ({ isLoading, images }) => {
  const { t } = useTranslation("common");

  return (
    <Row className="row-cols-1 row-cols-lg-2 row-cols-xl-3 g-4">
      {isLoading ? (
        <h1>{t("Loading")}...</h1>
      ) : (
        images.map((image, index) => (
          <Col key={index} className={`${filteredImagesStyles.colCard}`}>
            <CardDeck>
              <Card>
                <CardBody className="p-0">
                  <CardImg
                    className={`${filteredImagesStyles.cardImage}`}
                    top
                    src={image.path}
                    alt="Professional preview"
                  />
                  <div className={`${filteredImagesStyles.cardText}`}>
                    <Col className="col-3">
                      <img
                        className={`${filteredImagesStyles.imgProfile} rounded-circle`}
                        src={image.previewImage}
                      />
                    </Col>
                    <Col className={`col-9`}>
                      <CardText
                        className={`${filteredImagesStyles.textShadowSm} fw-bold`}
                      >{`${image.entity.contact}`}</CardText>
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
