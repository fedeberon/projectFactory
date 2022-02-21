import React from "react";
import useTranslation from "next-translate/useTranslation";
import Layout from "../../components/Layout/Layout";
import { Card, Button, Row, Col, Container } from "react-bootstrap";

const About = () => {
  const { t } = useTranslation("about");

  return (
    <Layout title={`${t("common:about-us")}`}>
      <section className="container content">
        <h4 className="text-center">
          {t("Our-platform-provides-a-solution-to")}
        </h4>
        <Row>
          <Col className="col-12 col-md-4">
            <Card className="p-1 border-0 bg-light">
              <Card.Body>
                <Card.Title tag="h5">{t("individuals")}</Card.Title>
                <Card.Text>{t("promote-individuals")}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col className="col-12 col-md-4">
            <Card className="p-1 border-0 bg-light">
              <Card.Body>
                <Card.Title tag="h5">{t("common:professional")}</Card.Title>
                <Card.Text>{t("promote-professional")}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col className="col-12 col-md-4">
            <Card className="p-1 border-0 bg-light">
              <Card.Body>
                <Card.Title tag="h5">{t("common:company")}</Card.Title>
                <Card.Text>{t("promote-company")}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Container className="col-12 bg-light my-3">
          <img
            className="col-12 col-md-6"
            src="/Hombre-2Busando-2Bla-2Bnotebook-2BHP-2BEliteBook-2B1020-2Ben-2Bla-2Boficina.jpeg"
          ></img>
          <p className="col-12 col-md-6 float-md-end p-5">
            <h1>Nuestra Mision</h1>
            <p>
              Poder crear a través de la arquitectura una plataforma digital
              que permita la interacción entre los <strong>Individuos Profesionales y Empresas</strong>
            </p>
            <h1>Nuestro Objetivo</h1>
            <p>
              Crear los vinculos que permitan a los usuarios <strong>Comprar, Vender y Publicar</strong> sus productos
            </p>
          </p>
        </Container>
        <Col className="p-3 d-flex justify-content-center">
          <Button variant="warning" href="/signIn">
            {t("common:sign-in")}
          </Button>
        </Col>
      </section>
    </Layout>
  );
};

export default About;
