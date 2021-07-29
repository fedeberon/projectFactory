import React from "react";
import useTranslation from "next-translate/useTranslation";
import Layout from "../../components/Layout/Layout";
import {
  Row,
  Col,
} from "react-bootstrap";

const Policies = () => {
  const { t } = useTranslation("policies");

  return (
    <Layout>
      <section className="container py-2">
        <Row className="d-flex justify-content-center">
          <Col xs={6} className="bg-light">
            <h4 className="text-center">{t("site-policies")}</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Facilisis sed odio morbi quis commodo. Quam lacus suspendisse
              faucibus interdum posuere lorem ipsum dolor sit. A diam maecenas sed
              enim ut sem viverra aliquet. Sollicitudin tempor id eu nisl nunc mi.
              Ut tortor pretium viverra suspendisse potenti nullam ac tortor.
              Facilisis gravida neque convallis a cras semper. Fusce id velit ut
              tortor pretium viverra. Accumsan sit amet nulla facilisi morbi
              tempus. Maecenas pharetra convallis posuere morbi leo. Accumsan
              tortor posuere ac ut consequat semper viverra nam libero.
            </p>
          </Col>
        </Row>
      </section>
    </Layout>
  );
};

export default Policies;
