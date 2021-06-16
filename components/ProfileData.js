import React, { useEffect, useState } from "react";
import { ListGroupItem, ListGroup, Container, Row, Col } from "reactstrap";
import { getSession, useSession } from "next-auth/client";
import { useTranslation } from "react-i18next";

// Components
import ModalForm from "../components/ModalForm";
import FormProfessional from "../components/FormProfessional";

const ProfileData = (props) => {
  const [session] = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const { t, lang } = useTranslation("common");
  const { onBecomeProfessional, error, setError } = props;

  const toggleModal = () => setModalOpen(!modalOpen);

  const authorities = session?.authorities.map((authoritie) => {
    return <ListGroupItem key={authoritie}>{authoritie}</ListGroupItem>;
  });

  return (
    <Container>
      {session ? (
        <>
          <button onClick={toggleModal}>{t("becomeProfessional")}</button>
          <Row>
            <Col>
              <img src={session.user.image}></img>
            </Col>
          </Row>
          <ListGroup>
            <h3>{t("Name")}</h3>
            <ListGroupItem>{session.user.name}</ListGroupItem>
            <h3>{t("Email")}</h3>
            <ListGroupItem>{session.user.email}</ListGroupItem>
            <h3>{t("Authorities")}</h3>
            {authorities}
          </ListGroup>
        </>
      ) : (
        <h1>{t("Without session")}</h1>
      )}

      <ModalForm
        modalTitle={t("FORM PROFESSIONAL")}
        className={"Button mt-50"}
        formBody={
          <FormProfessional
            onAddProfessional={onBecomeProfessional}
            toggle={toggleModal}
            error={error}
            setError={setError}
          />
        }
        modalOpen={{ open: modalOpen, function: setModalOpen }}
      />
    </Container>
  );
};

export default ProfileData;
