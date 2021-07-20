import React, { useState } from "react";

const ShowProfessionals = ({ isLoading, professionals }) => {
  const [showProfessionals, setShowProfessionals] = useState(false);

    return (
        <Row className="row-cols-md-3 g-4">
        {isLoading ? (
          <h1>{t("Loading")}...</h1>
        ) : (
          professionals.map((professional, index) => (
            <Col key={index}>
              <CardDeck>
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
              </CardDeck>
            </Col>
          ))
        )}
      </Row>
    )
};

export default ShowProfessionals;