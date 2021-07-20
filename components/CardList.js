import React from "react";
import { Card, Row, Col } from "react-bootstrap";
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
                <Card.Body>
                  <Company company={company} />
                </Card.Body>
              </Card>
            </Col>
            <Col className="col-12 col-md-2">
              <Card>
                <Card.Body>
                  <Card.Text>{company.province}</Card.Text>
                  <Card.Text>{company.location}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      ))}
    </Row>
  );
};

export default CardList;
