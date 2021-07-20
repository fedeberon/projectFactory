import React, { useState, useEffect } from "react";
import {
  ListGroupItem,
  ListGroup,
  Container,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { useSession, getSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";
import * as userService from "../../services/userService";

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
  const [amountTokens, setAmountTokens] = useState(-1);
  const { t } = useTranslation("profile");
  const {
    onBecomeProfessional,
    error,
    setError,
    data,
    onBuyPlan,
    linkToMercadopago,
    status,
  } = props;
  const [showModalPlan, setShowModalPlan] = useState(status == "approved");
  const [statusPurchased, setStatusPurchased] = useState(status);

  const toggleModalPlan = () => {
    setStatusPurchased("");
    setShowModalPlan(!showModalPlan);
  };

  useEffect( async () => {
    const session = await getSession();
    const tokens = await userService.getAmountTokens(session.accessToken);
    setAmountTokens(tokens);
  }, []);

  const toggleModal = () => setModalOpen(!modalOpen);

  return (
    <Container>
      {session ? (
        <>
          <Row className="row-cols-1 g-2">
            <Row className="p-0">
              <Row className="col-auto g-2 d-flex">
                {!session.authorities.includes("ROLE_PROFESSIONAL") &&
                !session.authorities.includes("ROLE_ADMINISTRATOR") &&
                !session.authorities.includes("ROLE_COMPANY") ? (
                  <>
                    <Col className="col-auto">
                      <Button variant="primary" onClick={toggleModal}>
                        <Briefcase size={25} />
                        {` `}
                        {t("become-professional")}
                      </Button>
                    </Col>
                    <Col className="col-auto">
                      <CompanyCreator />
                    </Col>
                  </>
                ) : (
                  <div>
                    <span className="d-block">{`${t("your-tokens")}: ${amountTokens}`}</span>
                    <Button onClick={toggleModalPlan}>
                      {t("buy-more-tokens")}
                    </Button>
                    <a
                      className={ProfileDataStyles.btnLinkAccount}
                      href={linkToMercadopago}
                    >
                      {t("link-account-to-mercadopago")}
                    </a>
                  </div>
                )}
              </Row>
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
        formBody={<Plans onBuyPlan={onBuyPlan} status={statusPurchased} />}
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
