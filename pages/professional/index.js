import React, { useCallback, useEffect, useState } from "react";
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
import { getSession, useSession } from "next-auth/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { findAll, addProfessional } from "../../services/professionalService";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { professionalActions } from "../../store";
import ModalForm from "../../components/ModalForm";

const Professional = ({ data }) => {
  const [session] = useSession();
  const [modalOpen, setModalOpen] = useState(false);

  const [isLoading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const professionals = useSelector((state) =>
    Object.values(state.professionals.items)
  );

  const { t, lang } = useTranslation("common");

  const toggleModal = () => setModalOpen(!modalOpen);

  useEffect(() => {
    dispatch(professionalActions.store(data));
  }, [data]);

  const onAddProfessional = async (data) => {
    setLoading(true);

    const professional = await addProfessional(data, session?.accessToken);
    if (professional) {
      dispatch(professionalActions.addItem(professional));
      setLoading(false);
    }
  };

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Container fluid>
      <Header lang={lang} />
      <h1>{t("Professional")}</h1>
      <Button className="position-fixed bottom-0 end-0 me-3 mb-3 rounded-circle zIndex" color="danger" onClick={toggleModal}>+</Button>
      <ModalForm
        buttonLabel={"+"}
        className={"Button mt-50"}
        formBody={(<FormProfessional onAddProfessional={onAddProfessional} />)}
        modalOpen={{"open" : modalOpen,"function":setModalOpen}}
      />
      <Row>
        {isLoading ? (
          <h1>{t("Loading")}...</h1>
        ) : !professionals ? (
          <h1>{professionals}</h1>
        ) : (
          professionals.map((professional, index) => (
            <Col md="4" key={index}>
              <CardDeck>
                <Card>
                  <CardBody>
                    <CardText>
                      {t("Name")}: {professional.firstName}
                    </CardText>
                    <CardText>
                      {t("Description")}: {professional.lastName}
                    </CardText>
                    <CardText>
                      {t("Email")}: {professional.email}
                    </CardText>
                  </CardBody>
                </Card>
              </CardDeck>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export async function getServerSideProps({ params, req, res, locale }) {
  // Get the user's session based on the request
  const session = await getSession({ req });

  let token;
  let professionals = [];
  let { page, size } = req.__NEXT_INIT_QUERY;

  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }

  if (session) {
    token = session.accessToken;
    professionals = await findAll(page, size, token);
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      data: professionals,
    },
  };
}

export default Professional;
