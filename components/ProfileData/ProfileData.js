import React, { useState, useEffect } from "react";
import {
  ListGroupItem,
  ListGroup,
  Container,
  Row,
  Col,
  Button,
  Figure,
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
import MercadopagoButton from "../Buttons/MercadopagoButton/MercadopagoButton";
import PrimaryButton from "../Buttons/PrimaryButton/PrimaryButton";

const ProfileData = (props) => {
  const [session] = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const [isLinkedWithMercadopago, setIsLinkedWithMercadopago] = useState(false);
  const [amountTokens, setAmountTokens] = useState(-1);
  const { t } = useTranslation("profile");
  const { onBecomeProfessional, error, setError, data, onBuyPlan, status } =
    props;
  const [showModalPlan, setShowModalPlan] = useState(status == "approved");
  const [statusPurchased, setStatusPurchased] = useState(status);

  const toggleModalPlan = () => {
    setStatusPurchased("");
    setShowModalPlan(!showModalPlan);
  };

  useEffect(async () => {
    const session = await getSession();
    const tokens = await userService.getAmountTokens(session.accessToken);
    const isLinkedWithMercadopago = await userService.isLinkedWithMercadopago(
      session.accessToken
    );
    setIsLinkedWithMercadopago(isLinkedWithMercadopago);
    setAmountTokens(tokens);
  }, []);

  const toggleModal = () => setModalOpen(!modalOpen);

  return (
    <Container>
      {session ? (
        <>
          <Row className="row-cols-1 gap-2 row w-100 m-0">
            <Col className="p-0">
              <Row className="p-0 row m-0 w-100 gap-2 gap-md-0 justify-content-center">
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
                  <>
                    <Col className="col-auto">
                      <span className="d-block">{`${t(
                        "your-tokens"
                      )}: ${amountTokens}`}</span>
                      <PrimaryButton dark onClick={toggleModalPlan}>
                        {t("buy-more-tokens")}
                      </PrimaryButton>
                    </Col>
                    <Col className="col-auto d-flex align-items-end">
                      <MercadopagoButton />
                    </Col>
                  </>
                )}
              </Row>
            </Col>
            <Col>
              <Row className="row-cols-1 row-cols-md-2 justify-content-center align-items-center">
                <Col className="col-auto">
                  <Figure className={`m-0`}>
                    <Figure.Image
                      width={200}
                      height={200}
                      className={`m-0`}
                      src={session.user.image}
                      roundedCircle
                    ></Figure.Image>
                  </Figure>
                </Col>
                <Col className="col-auto">
                  <ListGroup className="text-break">
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
