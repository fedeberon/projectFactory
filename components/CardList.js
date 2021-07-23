import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import Company from "../components/Company/Company";

const CardList = (props) => {
  const { companies } = props;

  return companies.map((company) => <Company company={company} key={company.id}/>);
};

export default CardList;
