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
import { useTranslation } from "react-i18next";

// Components
import ModalForm from "../components/ModalForm";
import RolProfile from "./RolProfile";
import FormProfessional from "../components/FormProfessional/FormProfessional";

const ProfileData = (props) => {
  const [session] = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const { t, lang } = useTranslation("common");
  const { onBecomeProfessional, error, setError, data } = props;

  const toggleModal = () => setModalOpen(!modalOpen);

  return (
    <Container>
      {session ? (
        <>
          <Row className="row-cols-1 g-2">
            <Col>
              {!session.authorities.includes("ROLE_PROFESSIONAL") &&
                <Button color="primary" onClick={toggleModal}>
                  {t("becomeProfessional")}
                </Button>
              }
            </Col>
            <Col>
              <img src={session.user.image}></img>
            </Col>
            <Col>
              <ListGroup>
                <h3>{t("Name")}</h3>
                <ListGroupItem>{session.user.name}</ListGroupItem>
                <h3>{t("Email")}</h3>
                <ListGroupItem>{session.user.email}</ListGroupItem>
                <h3>{t("Authorities")}</h3>
                {/* {authorities} */}
                <ListGroupItem><RolProfile/></ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
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
            data={data}
          />
        }
        modalOpen={{ open: modalOpen, function: setModalOpen }}
      />
    </Container>
  );
};

export default ProfileData;
