import React, { useEffect } from "react";
import {
  ListGroupItem,
  ListGroup,
  Container,
  Row,
  Col,
} from "reactstrap";
import { useSession } from "next-auth/client";
import { useTranslation } from "react-i18next";

const ProfileData = (props) => {
  const [session] = useSession();
  const { t, lang } = useTranslation("common");

  useEffect(() => {

  }, [session]);

  return (
    <Container>
      {session ? (
        <>
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
      </ListGroup>
        </>
      ) : (
        <h1>{t("Without session")}</h1>
      )}
    </Container>
  );
};

export default ProfileData;
