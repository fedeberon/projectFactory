import React from "react";
import { useSession } from "next-auth/client";
import { loginWith2FA } from "../services/userService.js";
import { download } from "../services/projectService.js";
import { Button, Col, Container, Input, Row } from "reactstrap";
import { Download } from "react-bootstrap-icons";

const FormTwoFactorAuthentication = ({ projectId }) => {
  const [session, loading] = useSession();

  const checkTwoFactorAuthenticationCode = async () => {
    const code = document.querySelector("#code").value;
    const wrongCode = document.querySelector("#wrong-code");
    const validCode = document.querySelector("#valid-code");
    try {
      const response = await loginWith2FA({ code: code }, session.accessToken);
      validCode.hidden = false;
      const token = response.token;
      download(projectId, token);
    } catch (e) {
      wrongCode.hidden = false;
    }
  };

  return (
    <>
      <Container className="my-2">
        <Row>
          <Col>
            <h1>Two factor authentication</h1>
            <h2>Enter the code of two factor authentication</h2>
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
                  <Download size={20} className="me-1"/> Download
                </Button>
                <span hidden style={{ color: "red" }} id="wrong-code">
                  Wrong code
                </span>
                <span hidden style={{ color: "green" }} id="valid-code">
                  Valid code
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
