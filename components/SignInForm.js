import React from "react";
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
import { useTranslation } from "react-i18next";
import { signIn } from "next-auth/client";
import { Google, Facebook, Instagram } from "react-bootstrap-icons";

const SignInForm = (props) => {
  const { t, lang } = useTranslation("common");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async ({ name, email, password }, event) => {
    let data = {
      name,
      email,
      password,
    };
  };
  const singUp = () => {
    const userName = document.querySelector ("#userName").value
    const password = document.querySelector ("#password").value
  }
  return (
    <Row className="d-flex justify-content-center">
      <Col xs={6}>
        <Card>
          <CardBody>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label for="email">{t("Email")}</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder={t("Write the email here please")}
                  {...register("email", {
                    required: {
                      value: true,
                      message: `${t("Email is required")}`,
                    },
                    minLength: {
                      value: 3,
                      message: `${t("Email cannot be less than 3 character")}`,
                    },
                  })}
                  className={"form-field" + (errors.email ? " has-error" : "")}
                />
                {errors.email && (
                  <FormText className="error-label">
                    {errors.email.message}
                  </FormText>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="name">{t("Name")}</Label>
                <Input
                  type="text"
                  id="userName"
                  placeholder={t("Write the name here please")}
                  {...register("name", {
                    required: {
                      value: true,
                      message: `${t("Name is required")}`,
                    },
                    minLength: {
                      value: 3,
                      message: `${t("Name cannot be less than 3 character")}`,
                    },
                  })}
                  className={"form-field" + (errors.name ? " has-error" : "")}
                />
                {errors.name && (
                  <FormText className="error-label">
                    {errors.name.message}
                  </FormText>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="password">{t("Password")}</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder={t("Write the password here please")}
                  {...register("password", {
                    required: {
                      value: true,
                      message: `${t("Password is required")}`,
                    },
                    minLength: {
                      value: 8,
                      message: `${t(
                        "Password cannot be less than 8 character"
                      )}`,
                    },
                  })}
                  className={
                    "form-field" + (errors.password ? " has-error" : "")
                  }
                />
                {errors.password && (
                  <FormText className="error-label">
                    {errors.password.message}
                  </FormText>
                )}
              </FormGroup>
              <Button color="primary" onClick={singUp} className="mt-2">{t("Sign in")}</Button>
            </Form>
            <Label for="Registrarse">Registrarse con:</Label>
            <Button onClick={() => signIn("google")} color="danger" className="mx-2" size={25}><Google/></Button>
            <Button onClick={() => signIn("facebook")} color="primary" className="mx-2" size={25}><Facebook/></Button>
            <Button onClick={() => signIn("instagram")} color="secondary" className="mx-2" size={25}><Instagram/></Button>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default SignInForm;
