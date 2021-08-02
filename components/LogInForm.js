import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, Card, Row, Col } from "react-bootstrap";
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
    <Row className="justify-content-center vh-100 align-items-center">
      <Col xs={12} md={10} lg={8}>
        <Card>
          <Card.Body className={`${styles.cardBody}`}>
            <Row className="justify-content-center">
              <Col className="col-auto my-3">
                <h2>{t("log-in")}</h2>
              </Col>
            </Row>
            <Row className="row-cols-1 row-cols-md-2 w-100 m-0">
              <Col className={`${styles.colDivision}`}>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group>
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
                  <Form.Group>
                    <Form.Label htmlFor="password">{t("password")}</Form.Label>
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
                  <PrimaryButton type="submit" dark className="mt-2 w-100">
                    {t("log-in")}
                  </PrimaryButton>
                  {/* {invalidCredentials && (
                    <div className="alert alert-danger mt-2" role="alert">
                      {t("invalid-credentials")}
                    </div>
                  )} */}
                </Form>
              </Col>
              <Col>
                <Form.Label htmlFor="Registrarse">
                  {t("log-in-with")}:
                </Form.Label>
                <Row className="row-cols-1 gap-2 row w-100 m-0">
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
                        <div>Conexión con Google</div>
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
                        <div>Conexión con Facebook</div>
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
                        <div>Conexión con Instagram</div>
                      </Col>
                    </Button>
                  </Col>
                </Row>
              </Col>
              <Col xs={12}>
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
              <Col xs={12} className="my-2">
                <Row>
                  <Col>
                    <Card.Text>
                      {t("don't-have-an-account-please")}
                      <Link href={"/signIn"}>
                        <a>{` ${t("register-here").toLowerCase()}`}</a>
                      </Link>
                    </Card.Text>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row className="justify-content-end">
              <Col className="col-auto">
                <Link href={"/"}>
                  <PrimaryButton>{t("go-back")}</PrimaryButton>
                </Link>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default LogInForm;
