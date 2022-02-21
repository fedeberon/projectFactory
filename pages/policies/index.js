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
            <h1>Nuestra Mision</h1>
            <p>
              Poder crear a través de la arquitectura una plataforma digial
              que permita la interaccción entre los <strong>Individuos Profesionales, Empresas</strong>
            </p>
            <h1>Nuestro Objetivo</h1>
            <p>
              Crear los vinculos que permitan a los usuarioas <strong>Comprar, Vender y Publicar</strong> sus productos
            </p>
          </Col>
        </Row>
      </section>
    </Layout>
  );
};

export default Policies;
