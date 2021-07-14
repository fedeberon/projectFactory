import React from "react";
import {
  Card,
  Button,
  CardTitle,
  CardText,
  CardBody,
  CardImg,
  Row,
  Col,
} from "reactstrap";
import Company from "../components/Company/Company";

const CardList = (props) => {
  const { companies } = props;
  return (
    <Row className="row-cols-1 g-2">
      {companies.map((company) => (
        <Col key={company.id}>
          <Card>
            <CardBody>
              <Company company={company} />
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default CardList;
