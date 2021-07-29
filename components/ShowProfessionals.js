import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import SpinnerCustom from "./SpinnerCustom/SpinnerCustom";

const ShowProfessionals = ({ isLoading, professionals }) => {
  const [showProfessionals, setShowProfessionals] = useState(false);

  return (
    <Row className="row-cols-md-3 g-4">
      {isLoading ? (
        <SpinnerCustom />
      ) : (
        professionals.map((professional, index) => (
          <Col key={index}>
            <Card>
              <Card.Img
                className="img-fluid"
                top
                src={professional.previewImage}
                alt="Professional preview"
              />
              <Card.Body>
                <Card.Text>
                  {t("FirstName")}: {professional.firstName}
                </Card.Text>
                <Card.Text>
                  {t("LastName")}: {professional.lastName}
                </Card.Text>
                <Card.Text>
                  {t("Email")}: {professional.email}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))
      )}
    </Row>
  );
};

export default ShowProfessionals;
