import React from "react";
import useTranslation from "next-translate/useTranslation";
import { Col, Row, Spinner } from "react-bootstrap";

const SpinnerCustom = () => {
  const { t } = useTranslation("common");
  return (
    <Row>
      <Col className="d-flex align-items-center gap-2">
        <Spinner animation="grow" variant="warning" />
        {`${t("loading")}...`}
      </Col>
    </Row>
  );
};

export default SpinnerCustom;
