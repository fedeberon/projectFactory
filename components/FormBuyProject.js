import React, { useState } from "react";
import { useEffect } from "react";
import { useSession } from "next-auth/client";
import * as mercadopagoService from "../services/mercadopagoService.js";
import { Button, Col, Form, Input, Label, Row } from "reactstrap";
import useTranslation from "next-translate/useTranslation";

const FormBuyProject = ({ projectId }) => {
  const [session, loading] = useSession();
  const [active, setActive] = useState(false);
  const { t } = useTranslation("common");

  useEffect(() => {
    if (window.Mercadopago && !active) {
      window.Mercadopago.setPublishableKey(
        process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
      );
      window.Mercadopago.getIdentificationTypes();
      setActive(true);
    }
  }, [projectId]);

  const onChangeCardNumber = () => {
    const cardNumber = document.getElementById("cardNumber");
    const paymentMethodId = document.getElementById("paymentMethodId");
    const issuerSelect = document.getElementById("issuer");
    const transactionAmount = document.getElementById("transactionAmount");
    const installments = document.getElementById("installments");
    const imgCard = document.querySelector("#card-img");
    
    const elements = {
      cardNumber,
      paymentMethodId,
      issuerSelect,
      transactionAmount,
      installments,
      imgCard,
    };
    mercadopagoService.completeElements(elements);
  };

  let doSubmit = false;
  const onClickBuyProject = (event) => {
    event.preventDefault();
    if (!doSubmit) {
      const transactionAmount =
        document.querySelector("#transactionAmount").value;
      const description = document.querySelector("#description").value;
      const installments = document.querySelector("#installments").value;
      const paymentMethodId = document.querySelector("#paymentMethodId").value;
      const docType = document.querySelector("#docType").value;
      const docNumber = document.querySelector("#docNumber").value;
      const email = document.querySelector("#email").value;
      const $form = document.getElementById("paymentForm");

      const elements = {
        transactionAmount,
        description,
        installments,
        paymentMethodId,
        docType,
        docNumber,
        email,
        projectId,
        accessToken: session.accessToken,
      };

      const pay = (status, response) =>
        mercadopagoService.getTokenAndPay(status, response, elements);
      window.Mercadopago.createToken($form, pay);
      doSubmit = false;
      return false;
    }
  };

  return (
    <>
      <Form
        method="post"
        id="paymentForm"
      >
        <Row className="my-3">
          <Col xs={4}>
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              name="email"
              type="text"
              placeholder={t("email")}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={2}>
            <Label htmlFor="docType">{t("doc-type")}</Label><br></br>
            <select
              id="docType"
              name="docType"
              data-checkout="docType"
              type="text"
              className="form-select"
            ></select>
          </Col>
          <Col xs={2}>
            <Label htmlFor="docNumber">{t("doc-number")}</Label>
            <Input
              id="docNumber"
              placeholder={t("doc-number")}
              name="docNumber"
              data-checkout="docNumber"
              type="text"
            />
          </Col>
        </Row>
        <Row className="my-3">
          <Col xs={4}>
            <Label htmlFor="cardholderName">{t("card-holder-name")}</Label>
            <Input
              id="cardholderName"
              placeholder={t("card-holder-name")}
              data-checkout="cardholderName"
              type="text"
            ></Input>
          </Col>
          <Row className="my-3">
            <Label htmlFor="cardExpirationMonth">{t("due-date")}</Label>
            <Col xs={1}>
              <Input
                type="text"
                placeholder="MM"
                id="cardExpirationMonth"
                data-checkout="cardExpirationMonth"
                autoComplete="off"
              ></Input>
            </Col>
            <Col xs={'auto'}>
              <span className="date-separator">/</span>
            </Col>
            <Col xs={1}>
              <Input
                type="text"
                placeholder="YY"
                id="cardExpirationYear"
                data-checkout="cardExpirationYear"
                autoComplete="off"
              ></Input>
            </Col>
          </Row>
          <Row>
          <Col xs={3}>
              <Label htmlFor="cardNumber">{t("card-number")}</Label>
              <Input
                type="number"
                placeholder={t("card-number")}
                id="cardNumber"
                data-checkout="cardNumber"
                onChange={onChangeCardNumber}
                autoComplete="off"
              ></Input>
            </Col>
            <Col xs={1}>
              <br></br>
              <img hidden id="card-img"></img>
            </Col>
          </Row>
          <Row>
            <Col className="my-3" xs={2}>
              <Label htmlFor="securityCode">{t("security-code")}</Label>
              <Input
                className="w-50"
                id="securityCode"
                placeholder={t("security-code")}
                data-checkout="securityCode"
                type="text"
                autoComplete="off"
              ></Input>
            </Col>
          </Row>
          <Row>
            <Col id="issuerInput" xs={4}>
              <Label htmlFor="issuer">{t("issuer-bank")}</Label><br></br>
              <select id="issuer" name="issuer" data-checkout="issuer" className="form-select"></select>
            </Col>
          </Row>
          <Row className="my-3">
            <Col xs={4}>
              <Label htmlFor="installments">{t("installments")}</Label><br></br>
              <select type="text" id="installments" name="installments" className="form-select"></select>
            </Col>
          </Row>
          <Row>
            <Col>
              <Input
                type="hidden"
                name="transactionAmount"
                id="transactionAmount"
                defaultValue="100"
              ></Input>
              <Input
                type="hidden"
                name="paymentMethodId"
                id="paymentMethodId"
              ></Input>
              <Input type="hidden" name="description" id="description"></Input>
              <br></br>
            </Col>
          </Row>
        </Row>
        <Row>
          <Col>
            <Button
              type="submit"
              id="btn-buy-project"
              outline
              color={"success"}
              size="lg"
              block
              onClick={onClickBuyProject}
              className="w-100"
            >
              {t("buy-project")}
            </Button>
            <br></br>
            <br></br>
            <span hidden id="successful" style={{ color: "green" }}>
              {t("project-purchased")}
            </span>
            <span hidden id="error" style={{ color: "red" }}>
              {t("invalid-card")}
            </span>
          </Col>
        </Row>
      </Form>
      <script src="https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js"></script>
    </>
  );
};

export default FormBuyProject;
