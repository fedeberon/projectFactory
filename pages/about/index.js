import React from "react";
import useTranslation from "next-translate/useTranslation";
import Layout from "../../components/Layout/Layout";
import {
  Card,
  Button,
  Row,
  Col,
  Container,
} from "react-bootstrap";

const About = () => {
  const { t } = useTranslation("about");

  return (
    <Layout title={`${t("common:about-us")}`}>
      <section className="container py-2">
        <h4 className="text-center">{t("Our-platform-provides-a-solution-to")}</h4>
        <Row>
          <Col className="col-12 col-md-4">
            <Card className="p-1 border-0 bg-light">
              <Card.Body>
                <Card.Title tag="h5">{t("individuals")}</Card.Title>
                <Card.Text>
                  {t("promote-individuals")}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col className="col-12 col-md-4">
            <Card className="p-1 border-0 bg-light">
              <Card.Body>
                <Card.Title tag="h5">{t("common:professional")}</Card.Title>
                <Card.Text>
                  {t("promote-professional")}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col className="col-12 col-md-4">
            <Card className="p-1 border-0 bg-light">
              <Card.Body>
                <Card.Title tag="h5">{t("common:company")}</Card.Title>
                <Card.Text>
                {t("promote-company")}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Container className="col-12 bg-light my-3">
          <img
            className="col-12 col-md-6"
            src="https://www.enlacehw.com/wp-content/uploads/2014/12/Hombre-2Busando-2Bla-2Bnotebook-2BHP-2BEliteBook-2B1020-2Ben-2Bla-2Boficina.jpg"
          ></img>
          <p className="col-12 col-md-6 float-md-end p-5">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Facilisis
            sed odio morbi quis commodo. Quam lacus suspendisse faucibus interdum
            posuere lorem ipsum dolor sit. A diam maecenas sed enim ut sem viverra
            aliquet. Sollicitudin tempor id eu nisl nunc mi. Ut tortor pretium
            viverra suspendisse potenti nullam ac tortor. Facilisis gravida neque
            convallis a cras semper. Fusce id velit ut tortor pretium viverra.
            Accumsan sit amet nulla facilisi morbi tempus. Maecenas pharetra
            convallis posuere morbi leo. Accumsan tortor posuere ac ut consequat
            semper viverra nam libero.
          </p>
        </Container>
        <Col className="p-3 d-flex justify-content-center">
          <Button
            variant="warning"
            href="/SignIn"
          >
            {t("common:sign-in")}
          </Button>
        </Col>
      </section>
    </Layout>
  );
};

export default About;
