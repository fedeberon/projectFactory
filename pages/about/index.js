import React from "react";
import useTranslation from "next-translate/useTranslation";
import Layout from "../../components/Layout/Layout";
import {
  Card,
  Button,
  CardImg,
  CardTitle,
  CardText,
  CardGroup,
  CardSubtitle,
  CardBody,
  Row,
  Col,
  Container,
} from "reactstrap";

const About = () => {
  const { t } = useTranslation("about");

  return (
    <Layout title={`${t("common:about-us")}`}>
      <h4 className="text-center">{t("Our-platform-provides-a-solution-to")}</h4>
      <Row>
        <Col className="col-12 col-md-4">
          <Card className="p-1 border-0 bg-light">
            <CardBody>
              <CardTitle tag="h5">{t("individuals")}</CardTitle>
              <CardText>
                {t("promote-individuals")}
              </CardText>
            </CardBody>
          </Card>
        </Col>
        <Col className="col-12 col-md-4">
          <Card className="p-1 border-0 bg-light">
            <CardBody>
              <CardTitle tag="h5">{t("common:professional")}</CardTitle>
              <CardText>
                {t("promote-professional")}
              </CardText>
            </CardBody>
          </Card>
        </Col>
        <Col className="col-12 col-md-4">
          <Card className="p-1 border-0 bg-light">
            <CardBody>
              <CardTitle tag="h5">{t("common:company")}</CardTitle>
              <CardText>
              {t("promote-company")}
              </CardText>
            </CardBody>
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
          color="warning"
          href="/SignIn"
        >
          {t("common:sign-in")}
        </Button>
      </Col>
    </Layout>
  );
};

export default About;
