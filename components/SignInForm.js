import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, FormGroup, Card, Row, Col } from "react-bootstrap";
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
import styles from "./SignInForm.module.css";
import PrimaryButton from "./Buttons/PrimaryButton/PrimaryButton";

const SignInForm = (props) => {
  const { t, lang } = useTranslation("common");
  const [usernameAlreadyExists, setUsernameAlreadyExists] = useState(false);
  const resetAlert = () => setUsernameAlreadyExists(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async ({ email, password }, event) => {
    try {
      await userService.add(email, password);
    } catch (e) {
      setUsernameAlreadyExists(true);
    }
  };

  return (
    <Row className="justify-content-center vh-100 align-items-center">
      <Col xs={12} md={10} lg={8}>
        <Card>
          <Card.Body className={`${styles.cardBody}`}>
            <Row className="justify-content-center">
              <Col className="col-auto my-3">
                <h2>{t("sign-in")}</h2>
              </Col>
            </Row>
            <Row className="row-cols-1 row-cols-md-2 w-100 m-0">
              <Col className={`${styles.colDivision}`}>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <FormGroup>
                    <Form.Label htmlFor="email">{t("email")}</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      onClick={resetAlert}
                      id="email"
                      placeholder={t("write-the-here-please", {
                        namePlaceholder: t("the-email").toLowerCase(),
                      })}
                      {...register("email", {
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
                        "form-field" + (errors.email ? " has-error" : "")
                      }
                    />
                    {errors.email && (
                      <Form.Text
                        variant="danger"
                        className="invalid error-Form.Label text-danger"
                      >
                        {errors.email.message}
                      </Form.Text>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Form.Label htmlFor="password">{t("password")}</Form.Label>
                    <Form.Control
                      type="password"
                      id="password"
                      onClick={resetAlert}
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
                  </FormGroup>
                  <PrimaryButton
                    type="submit"
                    dark
                    variant="primary"
                    className="mt-2 w-100"
                  >
                    {t("common:sign-in")}
                  </PrimaryButton>
                </Form>
              </Col>
              <Col>
                <Form.Label htmlFor="Registrarse">Registrarse con:</Form.Label>
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
                {usernameAlreadyExists && (
                  <div
                    className="alert alert-danger mt-2 d-flex align-items-center gap-2"
                    role="alert"
                  >
                    <ExclamationTriangle size={25} />
                    {t("common:username-already-exists")}
                  </div>
                )}
              </Col>
              <Col xs={12} className="my-2">
                <Row className="justify-content-end">
                  <Col className="col-auto">
                    <Link href={"/"}>
                      <PrimaryButton className="mt-2">
                        {t("go-back")}
                      </PrimaryButton>
                    </Link>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SignInForm;
