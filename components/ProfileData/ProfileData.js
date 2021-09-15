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
import { Briefcase, PersonCircle } from "react-bootstrap-icons";

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
  const {
    onBecomeProfessional,
    onSetProfessional,
    error,
    setError,
    data,
    onBuyPlan,
    status,
  } = props;
  const [showModalPlan, setShowModalPlan] = useState(status == "approved");
  const [statusPurchased, setStatusPurchased] = useState(status);
  const [stateFormProfessional, setStateFormProfessional] = useState({
    post: false,
    put: false,
  });

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

  const toggleModal = (mode) => {
    if (mode == "new") {
      setStateFormProfessional({
        post: true,
        put: false,
      });
    } else if (mode == "edit") {
      setStateFormProfessional({
        post: false,
        put: true,
      });
    }
    setModalOpen(!modalOpen);
  };

  return (
    <Container>
      {session ? (
        <>
          <Row className="row-cols-1 gap-4 row w-100 m-0">
            <Col className="p-0">
              <Row className="p-0 row m-0 w-100 gap-2 gap-md-0 justify-content-center">
                {!session.authorities.includes("ROLE_PROFESSIONAL") &&
                !session.authorities.includes("ROLE_ADMINISTRATOR") &&
                !session.authorities.includes("ROLE_COMPANY") ? (
                  <>
                    <Col className="col-auto">
                      <Button
                        variant="primary"
                        onClick={() => toggleModal("new")}
                      >
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
                      <PrimaryButton
                        type="button"
                        onClick={() => toggleModal("edit")}
                      >
                        {t("common:edit")}
                        {/* <Briefcase size={25} />
                        {` `}
                        {t("become-professional")} */}
                      </PrimaryButton>
                    </Col>
                    {/* <Col className="col-auto">
                      <span className="d-block">{`${t(
                        "your-tokens"
                      )}: ${amountTokens}`}</span>
                      <PrimaryButton dark onClick={toggleModalPlan}>
                        {t("buy-more-tokens")}
                      </PrimaryButton>
                    </Col>
                    <Col className="col-auto d-flex align-items-end p-0">
                      <MercadopagoButton />
                    </Col> */}
                  </>
                )}
              </Row>
            </Col>
            <Col>
              {!session.authorities.includes("ROLE_PROFESSIONAL") &&
              !session.authorities.includes("ROLE_COMPANY") ? (
                <>
                  <Row className="row-cols-1 row-cols-md-2 justify-content-center align-items-center">
                    <Col className="col-auto">
                      {session.user.image ? (
                        <Figure className={`m-0`}>
                          <Figure.Image
                            width={250}
                            height={250}
                            className={`${ProfileDataStyles.imgProfile} m-0`}
                            src={session.user.image}
                            roundedCircle
                          ></Figure.Image>
                        </Figure>
                      ) : (
                        <PersonCircle size={250} />
                      )}
                    </Col>
                    <Col className="col-12 col-lg-8 col-xl-4">
                      <Row className={`row-cols-1`}>
                        <Col>
                          <ListGroup className="text-break">
                            <h4>{t("common:formulary.contact")}</h4>
                            <ListGroupItem className={`mb-2`}>
                              {session.user.name}
                            </ListGroupItem>
                            <h4>{t("common:formulary.contact-email")}</h4>
                            <ListGroupItem className={`mb-2`}>
                              {session.user.email}
                            </ListGroupItem>
                            <h4>{t("authority")}</h4>
                            <ListGroupItem className={`mb-2`}>
                              <RolProfile />
                            </ListGroupItem>
                          </ListGroup>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <Row className="row-cols-1 row-cols-md-2 justify-content-evenly align-items-center">
                    <Col className="col-auto">
                      {session.user.image ? (
                        <Figure className={`m-0`}>
                          <Figure.Image
                            width={300}
                            height={300}
                            className={`${ProfileDataStyles.imgProfile} m-0`}
                            src={session.user.image}
                            roundedCircle
                          ></Figure.Image>
                        </Figure>
                      ) : (
                        <PersonCircle size={300} />
                      )}
                    </Col>
                    <Col className="col-auto col-lg-8 col-xl-7">
                      <Row className={`row-cols-1 row-cols-lg-2`}>
                        <Col>
                          <ListGroup className="text-break">
                            <h4>{t("common:formulary.contact")}</h4>
                            <ListGroupItem className={`mb-2`}>
                              {session.user.name}
                            </ListGroupItem>
                            <h4>{t("common:formulary.contact-email")}</h4>
                            <ListGroupItem className={`mb-2`}>
                              {session.user.email}
                            </ListGroupItem>
                            <h4>{t("authority")}</h4>
                            <ListGroupItem className={`mb-2`}>
                              <RolProfile />
                            </ListGroupItem>
                            {session.user.categoryCompany && (
                              <>
                                <h4>{t("common:formulary.company")}</h4>
                                <ListGroupItem className={`mb-2`}>
                                  {session.user.company.name}
                                </ListGroupItem>
                              </>
                            )}
                          </ListGroup>
                        </Col>
                        <Col>
                          <ListGroup className="text-break">
                            {session.user.categoryCompany && (
                              <>
                                <h4>
                                  {t("common:formulary.company-category")}
                                </h4>
                                <ListGroupItem className={`mb-2`}>
                                  {session.user.categoryCompany.name}
                                </ListGroupItem>
                              </>
                            )}
                            <h4>
                              {t("common:formulary.professional-category")}
                            </h4>
                            <ListGroupItem className={`mb-2`}>
                              {session.user.category.name}
                            </ListGroupItem>
                            <h4>{t("common:formulary.telephone")}</h4>
                            <ListGroupItem className={`mb-2`}>
                              {session.user.phoneNumber}
                            </ListGroupItem>
                            {session.user.website && (
                              <>
                                <h4>{t("common:formulary.web-page")}</h4>
                                <ListGroupItem className={`mb-2`}>
                                  {session.user.website}
                                </ListGroupItem>
                              </>
                            )}
                            <h4>{t("common:formulary.contact-charge")}</h4>
                            <ListGroupItem className={`mb-2`}>
                              {session.user.contactLoad}
                            </ListGroupItem>
                          </ListGroup>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              )}
            </Col>
          </Row>
        </>
      ) : (
        <h1>{t("without-session")}</h1>
      )}

      <ModalForm
        size={"xl"}
        fullscreen={"lg-down"}
        modalTitle={t("formulary-plan.title")}
        className={"Button mt-50"}
        formBody={<Plans onBuyPlan={onBuyPlan} status={statusPurchased} />}
        modalOpen={{ open: showModalPlan, function: setShowModalPlan }}
      />

      <ModalForm
        size={"xl"}
        fullscreen={"lg-down"}
        modalTitle={t("common:formulary.professional-form")}
        className={"Button mt-50"}
        formBody={
          <FormProfessional
            onAddProfessional={onBecomeProfessional}
            onSetProfessional={onSetProfessional}
            toggle={toggleModal}
            error={error}
            setError={setError}
            data={data}
            changeState={{
              stateFormProfessional,
              function: setStateFormProfessional,
            }}
          />
        }
        modalOpen={{ open: modalOpen, function: setModalOpen }}
      />
    </Container>
  );
};

export default ProfileData;
