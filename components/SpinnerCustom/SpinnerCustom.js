import React from "react";
import useTranslation from "next-translate/useTranslation";
import { Col, Row, Spinner } from "react-bootstrap";

const SpinnerCustom = (props) => {
  const { className } = props;
  const { t } = useTranslation("common");
  return (
    <Row className={className}>
      <Col className="d-flex align-items-center gap-2">
        <Spinner animation="border" variant="warning" />
        {`${t("loading")}...`}
      </Col>
    </Row>
  );
};

export default SpinnerCustom;
