import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Card,
  CardBody,
  Row,
  Col,
} from "reactstrap";
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

  const onSubmit = async ({ name, email, password }, event) => {
    try {
      await userService.add(name, password);
    } catch (e) {
      setUsernameAlreadyExists(true);
    }
  };

  return (
    <Row className="d-flex justify-content-center">
      <Col xs={6}>
        <Card>
          <CardBody>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label for="email">{t("email")}</Label>
                <Input
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
                  <FormText color="danger" className="error-label">
                    {errors.email.message}
                  </FormText>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="name">{t("name")}</Label>
                <Input
                  type="text"
                  onClick={resetAlert}
                  id="name"
                  placeholder={t("write-the-here-please", {
                    namePlaceholder: t("the-name").toLowerCase(),
                  })}
                  {...register("name", {
                    required: {
                      value: true,
                      message: `${t("is-required", {
                        nameRequired: t("the-name"),
                      })}`,
                    },
                    minLength: {
                      value: 3,
                      message: `${t("cannot-be-less-than-character", {
                        nameInput: t("the-name"),
                        numberCharacters: 3,
                      })}`,
                    },
                  })}
                  className={"form-field" + (errors.name ? " has-error" : "")}
                />
                {errors.name && (
                  <FormText color="danger" className="error-label">
                    {errors.name.message}
                  </FormText>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="password">{t("password")}</Label>
                <Input
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
                  <FormText color="danger" className="error-label">
                    {errors.password.message}
                  </FormText>
                )}
              </FormGroup>
              <Button type="submit" color="primary" className="mt-2">
                {t("common:sign-in")}
              </Button>
              {usernameAlreadyExists && (
                <div class="alert alert-danger" role="alert">
                  {t("common:username-already-exists")}
                </div>
              )}
            </Form>
            <Label for="Registrarse">Registrarse con:</Label>
            <Button
              onClick={() => signIn("google")}
              color="danger"
              className="mx-2"
            >
              <Google size={25} />
            </Button>
            <Button
              onClick={() => signIn("facebook")}
              color="primary"
              className="mx-2"
            >
              <Facebook size={25} />
            </Button>
            <Button
              onClick={() => signIn("instagram")}
              color="secondary"
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
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default SignInForm;
