import React, { useState } from "react";
import {
  ListGroupItem,
  ListGroup,
  Container,
  Row,
  Col,
  Button,
} from "reactstrap";
import { useSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";

// Components
import ModalForm from "../components/ModalForm";
import RolProfile from "./RolProfile";
import FormProfessional from "../components/FormProfessional/FormProfessional";

const ProfileData = (props) => {
  const [session] = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation("profile");
  const { onBecomeProfessional, error, setError, data } = props;

  const toggleModal = () => setModalOpen(!modalOpen);

  return (
    <Container>
      {session ? (
        <>
          <Row className="row-cols-1 g-2">
            <Col>
              {!session.authorities.includes("ROLE_PROFESSIONAL") && (
                <Button color="primary" onClick={toggleModal}>
                  {t("become-professional")}
                </Button>
              )}
            </Col>
            <Col>
              <img src={session.user.image}></img>
            </Col>
            <Col>
              <ListGroup>
                <h3>{t("common:name")}</h3>
                <ListGroupItem>{session.user.name}</ListGroupItem>
                <h3>{t("common:email")}</h3>
                <ListGroupItem>{session.user.email}</ListGroupItem>
                <h3>{t("authority")}</h3>
                <ListGroupItem>
                  <RolProfile />
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
        </>
      ) : (
        <h1>{t("without-session")}</h1>
      )}

      <ModalForm
        modalTitle={t("formulary.professional-form")}
        className={"Button mt-50"}
        formBody={
          <FormProfessional
            onAddProfessional={onBecomeProfessional}
            toggle={toggleModal}
            error={error}
            setError={setError}
            data={data}
          />
        }
        modalOpen={{ open: modalOpen, function: setModalOpen }}
      />
    </Container>
  );
};

export default ProfileData;
