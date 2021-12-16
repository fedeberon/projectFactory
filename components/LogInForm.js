import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, Card, Row, Col, Container } from "react-bootstrap";
import useTranslation from "next-translate/useTranslation";
import { signIn } from "next-auth/client";
import {
  Google,
  Facebook,
  Instagram,
  ExclamationTriangle,
} from "react-bootstrap-icons";
import * as userService from "../services/userService";
import Link from "next/link";
import PrimaryButton from "./Buttons/PrimaryButton/PrimaryButton";
import styles from "./LogInForm.module.css";
import Header from "./Header/Header";
import AnchorButton from "./Buttons/AnchorButton/AnchorButton";

const LogInForm = (props) => {
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const { t } = useTranslation("common");
  const resetInvalidCredentials = () => setInvalidCredentials(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async ({ username, password }, event) => {
    try {
      await userService.login(username, password);
    } catch (e) {
      console.error(e);
      setInvalidCredentials(true);
    }
  };

  return (
    <Container fluid={"xs"} className="p-0">
      <Row className="row min-vh-100 justify-content-center w-100 m-0 gap-1">
        <Col xs={12} className={"p-0"}>
          <Header navSearch={false} finder={false} authentication={false} />
        </Col>
        <Col xs={12} md={10} lg={8} xl={6}>
          <Card className={`${styles.card}`}>
            <Card.Body className={`${styles.cardBody}`}>
              <Row className="justify-content-center">
                <Col className="col-auto my-3">
                  <h2>{t("log-in")}</h2>
                </Col>
              </Row>
              <Row className="row-cols-1 row-cols-md-2 w-100 m-0 gap-3 gap-md-0">
                <Col
                  className={`${styles.colDivision} pb-3 pb-md-0 order-md-1`}
                >
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="username">{t("email")}</Form.Label>
                      <Form.Control
                        type="text"
                        onClick={resetInvalidCredentials}
                        name="username"
                        id="username"
                        placeholder={t("write-the-here-please", {
                          namePlaceholder: t("the-email").toLowerCase(),
                        })}
                        {...register("username", {
                          required: {
                            value: true,
                            message: `${t("is-required", {
                              nameRequired: t("the-email"),
                            })}`,
                          },
                          minLength: {
                            value: 3,
                            message: `${t("cannot-be-less-than-character", {
                              nameInput: t("the-email"),
                              numberCharacters: 3,
                            })}`,
                          },
                        })}
                        className={
                          "form-field" + (errors.username ? " has-error" : "")
                        }
                      />
                      {errors.username && (
                        <Form.Text
                          variant="danger"
                          className="invalid error-Form.Label text-danger"
                        >
                          {errors.username.message}
                        </Form.Text>
                      )}
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="password">
                        {t("password")}
                      </Form.Label>
                      <Form.Control
                        type="password"
                        id="password"
                        onClick={resetInvalidCredentials}
                        placeholder={t("write-the-here-please", {
                          namePlaceholder: t("the-password").toLowerCase(),
                        })}
                        {...register("password", {
                          required: {
                            value: true,
                            message: `${t("is-required", {
                              nameRequired: t("the-password"),
                            })}`,
                          },
                          minLength: {
                            value: 8,
                            message: `${t("cannot-be-less-than-character", {
                              nameInput: t("the-password"),
                              numberCharacters: 8,
                            })}`,
                          },
                        })}
                        className={
                          "form-field" + (errors.password ? " has-error" : "")
                        }
                      />
                      {errors.password && (
                        <Form.Text
                          variant="danger"
                          className="invalid error-Form.Label text-danger"
                        >
                          {errors.password.message}
                        </Form.Text>
                      )}
                    </Form.Group>
                    <PrimaryButton type="submit" yellow className="mt-2 w-100">
                      {t("log-in")}
                    </PrimaryButton>
                  </Form>
                </Col>
                <Col xs={12} className="order-md-3 my-md-3">
                  {invalidCredentials && (
                    <div
                      className="alert alert-danger mt-2 d-flex align-items-center gap-2"
                      role="alert"
                    >
                      <ExclamationTriangle size={25} />
                      {t("invalid-credentials")}
                    </div>
                  )}
                </Col>
                <Col className="order-md-2 my-auto">
                  <Row className="row-cols-1 gap-3 row w-100 m-0">
                    <Col className="col-12 p-0">
                      <Button
                        onClick={() => signIn("google")}
                        variant="outline-danger"
                        className=" w-100 d-flex gap-2 "
                      >
                        <Col className="col-auto">
                          <Google size={25} />
                        </Col>
                        <Col className="col-auto mx-auto">
                          <div>{t("connect-with")} Google</div>
                        </Col>
                      </Button>
                    </Col>
                    <Col className="col-12 p-0">
                      <Button
                        onClick={() => signIn("facebook")}
                        variant="outline-primary"
                        className=" w-100 d-flex gap-2"
                      >
                        <Col className="col-auto">
                          <Facebook size={25} />
                        </Col>
                        <Col className="col-auto mx-auto">
                          <div>{t("connect-with")} Facebook</div>
                        </Col>
                      </Button>
                    </Col>
                    <Col className="col-12 p-0">
                      <Button
                        onClick={() => signIn("instagram")}
                        variant="outline-secondary"
                        className={`w-100 d-flex gap-2`}
                      >
                        <Col className="col-auto">
                          <Instagram
                            size={25}
                            className={`${styles.instagram}`}
                          />
                        </Col>
                        <Col className="col-auto mx-auto">
                          <div>{t("connect-with")} Instagram</div>
                        </Col>
                      </Button>
                    </Col>
                  </Row>
                </Col>

                <Col xs={12} className="order-md-4">
                  <Row className="row-cols-1 gap-3">
                    <Col>
                      <Card.Text className={styles.textBold}>
                        {t("don't-have-an-account-please")}
                        <Link href={"/signIn"}>
                          <a className="text-reset">{` ${t(
                            "register-here"
                          ).toLowerCase()}`}</a>
                        </Link>
                      </Card.Text>
                    </Col>
                    <Col>
                      <Card.Text className={`${styles.textSmall} text-muted`}>
                        {`${t("by-continuing-i-accept-the")} `}
                        <AnchorButton
                          title={t("terms-of-use")}
                          href={"/terms-and-conditions"}
                          className="text-reset"
                        />
                        {` ${t("and-accept-the")} `}
                        <AnchorButton title={t("privacy-policy")} href={"/"} />
                        {`. ${t(
                          "project-factory-can-send-me-marketing-emails"
                        )}.`}
                      </Card.Text>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LogInForm;
