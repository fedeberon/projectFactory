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
import ModalForm from "../ModalForm";
import RolProfile from "../RolProfile";
import FormProfessional from "../FormProfessional/FormProfessional";
import Plans from "../Plans/Plans";
import CompanyCreator from "../CompanyCreator/CompanyCreator";
import { Briefcase } from "react-bootstrap-icons";

//Styles
import ProfileDataStyles from "./ProfileData.module.css";

const ProfileData = (props) => {
  const [session] = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation("profile");
  const { onBecomeProfessional, error, setError, data, onBuyPlan } = props;
  const [showModalPlan, setShowModalPlan] = useState(false);

  const toggleModalPlan = () => setShowModalPlan(!showModalPlan);

  const toggleModal = () => setModalOpen(!modalOpen);

  return (
    <Container>
      {session ? (
        <>
          <Row className="row-cols-1 g-2">
            <Row className="p-0">
              <Col className="col-auto">
                {
                !session.authorities.includes("ROLE_PROFESSIONAL") &&
                !session.authorities.includes("ROLE_ADMINISTRATOR") &&
                !session.authorities.includes("ROLE_COMPANY") ? (
                  <Button color="primary" onClick={toggleModal}>
                    <Briefcase size={25} />
                    {` `}
                    {t("become-professional")}
                  </Button>
                ) : (
                  <Button onClick={toggleModalPlan}>
                    {t("buy-more-tokens")}
                  </Button>
                )}
              </Col>
              {!session.authorities.includes("ROLE_COMPANY") &&
                !session.authorities.includes("ROLE_ADMINISTRATOR") &&
                !session.authorities.includes("ROLE_PROFESSIONAL") && (
                  <Col className="col-auto">
                    <CompanyCreator />
                  </Col>
                )}
            </Row>
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
        size={"xl"}
        modalTitle={t("formulary-plan.title")}
        className={"Button mt-50"}
        formBody={<Plans onBuyPlan={onBuyPlan} />}
        modalOpen={{ open: showModalPlan, function: setShowModalPlan }}
      />
      <ModalForm
        size={"xl"}
        modalTitle={t("common:formulary.professional-form")}
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
