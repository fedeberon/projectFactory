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
import ModalFormProfessional from "../../components/ModalFormProfessional";
import { addPreviewImage, addBackgroundImage } from "../../services/professionalService";

const Professional = ({ data }) => {
  const [session] = useSession();

  const [isLoading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const professionals = useSelector((state) =>
    Object.values(state.professionals.items)
  );

  const { t, lang } = useTranslation("common");

  useEffect(() => {
    dispatch(professionalActions.store(data));
  }, [data]);

  const onAddProfessional = async (data) => {
    setLoading(true);
    const previewImage = data.previewImage;
    const backgroundImage = data.backgroundImage;
    const professional = await addProfessional(data, session?.accessToken);

    if (professional?.id) {
      dispatch(professionalActions.addItem(professional));
      setLoading(false);
      if (previewImage) {
        await addPreviewImage(previewImage, professional.id, session.accessToken);
      }
      
      if (backgroundImage) {
        await addBackgroundImage(backgroundImage, professional.id, session.accessToken);
      }
    } else {
      throw new Error(`Email already exists`);
    }
  };

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Container fluid>
      <Header lang={lang} />
      <h1>{t("Professional")}</h1>
      <ModalFormProfessional
        onAddProfessional={onAddProfessional}
        buttonLabel={"+"}
        className={"Button mt-50"}
      />
      <Row>
        {isLoading ? (
          <h1>{t("Loading")}...</h1>
        ) : !professionals ? (
          <h1>{professionals}</h1>
        ) : (
          professionals.map((professional) => (
            <Col key={professional.id} md="4">
              <div className="mt-3" key={professional.id}>
                <CardDeck>
                  <Card>
                    <CardImg top width="100%" src={professional.previewImage} alt="Professional preview" />
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
              </div>
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
