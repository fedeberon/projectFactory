import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import useTranslation from "next-translate/useTranslation";
import { signIn } from "next-auth/client";
import { Google, Facebook, Instagram } from "react-bootstrap-icons";
import * as userService from "../services/userService";
import Link from "next/link";

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
      setInvalidCredentials(true);
    }
  };

  return (
    <Row className="d-flex justify-content-center">
      <Col xs={6}>
        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group>
                <Form.Label htmlFor="username">{t("username")}</Form.Label>
                <Form.Control
                  type="text"
                  onClick={resetInvalidCredentials}
                  name="username"
                  id="username"
                  placeholder={t("write-the-here-please", {
                    namePlaceholder: t("the-username").toLowerCase(),
                  })}
                  {...register("username", {
                    required: {
                      value: true,
                      message: `${t("is-required", {
                        nameRequired: t("the-username"),
                      })}`,
                    },
                    minLength: {
                      value: 3,
                      message: `${t("cannot-be-less-than-character", {
                        nameInput: t("the-username"),
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
              <Button type="submit" variant="primary" className="mt-2">
                {t("log-in")}
              </Button>
              {invalidCredentials && (
                <div className="alert alert-danger" role="alert">
                  {t("invalid-credentials")}
                </div>
              )}
            </Form>
            <Form.Label htmlFor="Registrarse">{t("log-in-with")}:</Form.Label>
            <Button
              onClick={() => signIn("google")}
              variant="danger"
              className="mx-2"
            >
              <Google size={25} />
            </Button>
            <Button
              onClick={() => signIn("facebook")}
              variant="primary"
              className="mx-2"
            >
              <Facebook size={25} />
            </Button>
            <Button
              onClick={() => signIn("instagram")}
              variant="secondary"
              className="mx-2"
            >
              <Instagram size={25} />
            </Button>
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
            <Row className="justify-content-end">
              <Col className="col-auto">
                <Link href={"/"}>
                  <Button>{t("go-back")}</Button>
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
