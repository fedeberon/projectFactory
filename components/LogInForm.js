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

const LogInForm = (props) => {
    const [invalidCredentials, setInvalidCredentials] = useState(false)
    const { t } = useTranslation("common");
    const resetInvalidCredentials = () => setInvalidCredentials(false);

    const {
      register,
      formState: { errors },
      handleSubmit,
    } = useForm();
  
    const onSubmit = async ({ email, password }, event) => {
      try {
        await userService.login(email, password);
      } catch (e) {
        setInvalidCredentials(true);
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
                  onClick={resetInvalidCredentials}
                  name="email"
                  id="email"
                  placeholder={t("write-the-here-please", {
                    namePlaceholder: t("the-email")
                  })}
                  {...register("email", {
                    required: {
                      value: true,
                      message: `${t("is-required", {
                        namePlaceholder: t("the-email")
                      })}`,
                    },
                    minLength: {
                      value: 3,
                      message: `${t("cannot-be-less-than-character", {
                        nameInput: t("the-email"),
                        numberCharacters: 3
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
                <Label for="password">{t("password")}</Label>
                <Input
                  type="password"
                  id="password"
                  resetInvalidCredentials
                  placeholder={t("write-the-here-please", {
                    namePlaceholder: t("the-password").toLowerCase()
                  })}
                  {...register("password", {
                    required: {
                      value: true,
                      message: `${t("is-required", {
                        nameRequired: t("the-password")
                      })}`,
                    },
                    minLength: {
                      value: 8,
                      message: `${t(
                        "cannot-be-less-than-character", {
                          nameInput: t("the-password"),
                          numberCharacters: 8
                        }
                      )}`,
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
              <Button color="primary" className="mt-2">{t("log-in")}</Button>
              {invalidCredentials &&
                <div class="alert alert-danger" role="alert">
                  {t("invalid-credentials")}
                </div>
              }
            </Form> 
            <Label for="Registrarse">{t("log-in-with")}:</Label>
            <Button onClick={() => signIn("google")} color="danger" className="mx-2" size={25}><Google/></Button>
            <Button onClick={() => signIn("facebook")} color="primary" className="mx-2" size={25}><Facebook/></Button>
            <Button onClick={() => signIn("instagram")} color="secondary" className="mx-2" size={25}><Instagram/></Button>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default LogInForm;