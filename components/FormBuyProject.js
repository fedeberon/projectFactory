import React, { useState } from "react";
import { useEffect } from "react";
import { useSession } from "next-auth/client";
import * as mercadopagoService from "../services/mercadopagoService.js";
import { Button, Col, Form, Input, Label, Row } from "reactstrap";

const FormBuyProject = ({ projectId }) => {
  const [session, loading] = useSession();
  const [active, setActive] = useState(false);

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
    const elements = {
      cardNumber,
      paymentMethodId,
      issuerSelect,
      transactionAmount,
      installments,
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
        action="http://localhost:8082/project-factory/api/v1/mercadopago/process_payment"
        method="post"
        id="paymentForm"
      >
        <h3>Detalles del comprador</h3>
        <p>Use this card number for test payment: 5031-7557-3453-0604</p>
        <Row>
          <Col>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="text"
              defaultValue="test@test.com"
            />
          </Col>
          <Col>
            <Label htmlFor="docType">Tipo de documento</Label>
            <select
              id="docType"
              name="docType"
              data-checkout="docType"
              type="text"
            ></select>
          </Col>
          <Col>
            <Label htmlFor="docNumber">Número de documento</Label>
            <Input
              id="docNumber"
              defaultValue="41999064"
              name="docNumber"
              data-checkout="docNumber"
              type="text"
            />
          </Col>
        </Row>
        <h3>Detalles de la tarjeta</h3>
        <Row>
          <Col>
            <Label htmlFor="cardholderName">Titular de la tarjeta</Label>
            <Input
              id="cardholderName"
              defaultValue="Tomas Arras"
              data-checkout="cardholderName"
              type="text"
            ></Input>
          </Col>
          <Row>
            <Label htmlFor="">Fecha de vencimiento</Label>
            <Col xs={1}>
              <Input
                type="text"
                defaultValue="11"
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
                defaultValue="25"
                placeholder="YY"
                id="cardExpirationYear"
                data-checkout="cardExpirationYear"
                autoComplete="off"
              ></Input>
            </Col>
          </Row>
          <Col>
            <Label htmlFor="cardNumber">Número de la tarjeta</Label>
            <Input
              type="text"
              id="cardNumber"
              data-checkout="cardNumber"
              onChange={onChangeCardNumber}
              autoComplete="off"
            ></Input>
          </Col>
          <Col>
            <Label htmlFor="securityCode">Código de seguridad</Label>
            <Input
              id="securityCode"
              defaultValue="123"
              data-checkout="securityCode"
              type="text"
              autoComplete="off"
            ></Input>
          </Col>
          <Col id="issuerInput">
            <Label htmlFor="issuer">Banco emisor</Label>
            <select id="issuer" name="issuer" data-checkout="issuer"></select>
          </Col>
          <Col>
            <Label htmlFor="installments">Cuotas</Label>
            <select type="text" id="installments" name="installments"></select>
          </Col>
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
              Buy project
            </Button>
            <br></br>
            <span hidden id="successful" style={{ color: "green" }}>
              You have purchased this project
            </span>
            <span hidden id="error" style={{ color: "red" }}>
              Error
            </span>
          </Col>
        </Row>
      </Form>
      <script src="https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js"></script>
    </>
  );
};

export default FormBuyProject;
