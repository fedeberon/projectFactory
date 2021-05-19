import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
import {
  Col,
  Container,
  Row,
  Card,
  Button,
  CardImg,
  CardTitle,
  CardText,
  CardGroup,
  CardSubtitle,
  CardBody,
  CardDeck,
} from "reactstrap";
import FormProfessional from "../../components/FormProfessional";
import { useSession } from "next-auth/client";
import { getProfessionals, addProfessional } from "../_clientServices";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ModalFormProfessional from "../../components/ModalFormProfessional";

const Professional = () => {
  const [session] = useSession();
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(false);

  const { t, lang } = useTranslation("common");

  const updateProfessionalList = async () => {
    setLoading(true);
    const professionals = await getProfessionals();
    setData(professionals);
    setLoading(false);
  };

  const onAddProfessional = async (data) => {
    setLoading(true);
    await addProfessional(data, session);
    await updateProfessionalList();
  };

  useEffect(async () => {
    await updateProfessionalList();
  }, [session]);

  return (
    <Container fluid>
      <Header lang={lang} />
      <h1>{t("Professional")}</h1>
      <ModalFormProfessional onAddProfessional={onAddProfessional}  buttonLabel={"+"} className={"Button mt-50"}/>
      <Row>
        {isLoading ? (
          <h1>{t("Loading")}...</h1>
        ) : !data ? (
          <h1>{data}</h1>
        ) : (
          data.map((professionals) => (
            <Col md="4">
              <div class="mt-3" key={professionals.id}>
                <CardDeck>
                  <Card>
                    <CardBody>
                      <CardText>
                        {t("Name")}: {professionals.firstName}
                      </CardText>
                      <CardText>
                        {t("Description")}: {professionals.lastName}
                      </CardText>
                      <CardText>
                        {t("Email")}: {professionals.email}
                      </CardText>
                    </CardBody>
                  </Card>
                </CardDeck>
              </div>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default Professional;
