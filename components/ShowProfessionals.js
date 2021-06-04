import React from "react";

const ShowProfessionals = ({ isLoading, professionals }) => {
    return (
        <Row className="row-cols-md-3 g-4">
        {isLoading ? (
          <h1>{t("Loading")}...</h1>
        ) : (
          professionals.map((professional, index) => (
            <Col key={index}>
              <CardDeck>
                <Card>
                  <CardImg
                    className="img-fluid"
                    top
                    src={professional.previewImage}
                    alt="Professional preview"
                  />
                  <CardBody>
                    <CardText>
                      {t("FirstName")}: {professional.firstName}
                    </CardText>
                    <CardText>
                      {t("LastName")}: {professional.lastName}
                    </CardText>
                    <CardText>
                      {t("Email")}: {professional.email}
                    </CardText>
                  </CardBody>
                </Card>
              </CardDeck>
            </Col>
          ))
        )}
      </Row>
    )
};

export default ShowProfessionals;