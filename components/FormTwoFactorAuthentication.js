import React from "react";
import { useSession } from "next-auth/client";
import * as userService from "../services/userService.js";
import * as projectService from "../services/projectService.js";
import { Button, Col, Container, Input, Row } from "reactstrap";
import { Download } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";

const FormTwoFactorAuthentication = ({ projectId }) => {
  const [session, loading] = useSession();
  const { t, lang } = useTranslation("common");

  const checkTwoFactorAuthenticationCode = async () => {
    const code = document.querySelector("#code").value;
    const wrongCode = document.querySelector("#wrong-code");
    const validCode = document.querySelector("#valid-code");
    try {
      const response = await userService.loginWith2FA({ code: code }, session.accessToken);
      validCode.hidden = false;
      const token = response.token;
      projectService.download(projectId, token);
    } catch (e) {
      wrongCode.hidden = false;
    }
  };

  return (
    <>
      <Container className="my-2">
        <Row>
          <Col>
            <h1>{t("TwoFactorAuthentication")}</h1>
            <h2>{t("EnterCode")}</h2>
            <Row>
              <Col xs={10}>
                <Input id="code" type="number"></Input>
              </Col>
              <Col xs={"auto"}>
                <Button
                  outline
                  color={"success"}
                  onClick={checkTwoFactorAuthenticationCode}
                >
                  <Download size={20} className="me-1"/> {t("Download")}
                </Button>
                <br></br>
                <span hidden style={{ color: "red" }} id="wrong-code">
                  {t("WrongCode")}
                </span>
                <span hidden style={{ color: "green" }} id="valid-code">
                  {t("ValidCode")}
                </span>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default FormTwoFactorAuthentication;
