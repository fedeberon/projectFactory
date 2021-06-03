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
import * as professionalService from "../../services/professionalService";
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
    const previewImage = data.previewImage;
    const backgroundImage = data.backgroundImage;
    const images = data.images;
    const professional = await professionalService.addProfessional(data, session?.accessToken);
    
    try {
      if (professional?.id) {
        if (previewImage) {
          await professionalService.addPreviewImage(previewImage, professional.id, session.accessToken);
          professional.previewImage = URL.createObjectURL(previewImage);
        }
        
        if (backgroundImage) {
          await professionalService.addBackgroundImage(backgroundImage, professional.id, session.accessToken);
          professional.backgroundImage = URL.createObjectURL(backgroundImage);
        }

        if (images.length > 0) {
          await professionalService.addImages(images, professional.id, session.accessToken);
        }

        dispatch(professionalActions.addItem(professional));
        setLoading(false);
      } else {
        throw new Error(`Email already exists`);
      }
    } catch (e) {
      setLoading(false);
      alert(t("EmailAlreadyExists"))
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
        modalTitle={t("FORM PROFESSIONAL")}
        className={"Button mt-50"}
        formBody={(<FormProfessional onAddProfessional={onAddProfessional} toggle={toggleModal}/>)}
        modalOpen={{"open" : modalOpen,"function":setModalOpen}}
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
                        {t("FirstName")}: {professional.firstName}
                      </CardText>
                      <CardText>
                        {t("LastName")}: {professional.lastName}
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
    professionals = await professionalService.findAll(page, size, token);
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      data: professionals,
    },
  };
}

export default Professional;
