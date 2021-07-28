import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, FormGroup, Card, Row, Col } from "react-bootstrap";
import useTranslation from "next-translate/useTranslation";
import { signIn } from "next-auth/client";
import { Google, Facebook, Instagram } from "react-bootstrap-icons";
import * as userService from "../services/userService";
import Link from "next/link";

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
    <Row className="d-flex justify-content-center">
      <Col xs={6}>
        <Card>
          <Card.Body>
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
                  className={"form-field" + (errors.email ? " has-error" : "")}
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
              <Button type="submit" variant="primary" className="mt-2">
                {t("common:sign-in")}
              </Button>
              {usernameAlreadyExists && (
                <div className="alert alert-danger" role="alert">
                  {t("common:username-already-exists")}
                </div>
              )}
            </Form>
            <Form.Label htmlFor="Registrarse">Registrarse con:</Form.Label>
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

export default SignInForm;
