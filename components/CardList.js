import React from "react";
import { Card, CardBody, Row, Col, CardText } from "reactstrap";
import Company from "../components/Company/Company";

const CardList = (props) => {
  const { companies } = props;
  return (
    <Row className="row-cols-1 g-2">
      {companies.map((company) => (
        <Col key={company.id}>
          <Row>
            <Col className="col-12 col-md-10">
              <Card>
                <CardBody>
                  <Company company={company} />
                </CardBody>
              </Card>
            </Col>
            <Col className="col-12 col-md-2">
              <Card>
                <CardBody>
                  <CardText>{company.province}</CardText>
                  <CardText>{company.location}</CardText>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>
      ))}
    </Row>
  );
};

export default CardList;
