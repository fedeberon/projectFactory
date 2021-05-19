import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
} from "reactstrap";
import ModalFormProfessional from "./ModalFormProfessional";

const FormProfessional = ({onAddProfessional}) => {

  const { t, lang } = useTranslation("common");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async ({ firstName, lastName, email }, event) => {
    // You should handle login logic with firstName, lastName and email form data
    let data = {
      firstName,
      lastName,
      email,
    };
    await onAddProfessional(data);
    event.target.reset();
  };

  return (
    <div>
    <Container fluid="sm"> 
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col>
            <h3 className="form-header">{t("FORM PROFESSIONAL")}</h3>
          </Col>
        </Row>
        <FormGroup>
          <Label for="firstName">{t("FirstName")}</Label>
          <Input
            type="text"
            name="firstName"
            id="firstName"
            placeholder={t("Write the name here please")}
            {...register("firstName", {
              required: { value: true, message: `${t("FirstName is required")}` },
              minLength: {
                value: 3,
                message: `${t("FirstName cannot be less than 3 character")}`,
              },
            })}
            className={"form-field" + (errors.firstName ? " has-error" : "")}
          />
          {errors.firstName && (
            <FormText className="invalid error-label">
              {errors.firstName.message}
            </FormText>
          )}
        </FormGroup>
        <FormGroup>
          <Label for="lastName">{t("LastName")}</Label>
          <Input
            type="text"
            name="lastName"
            id="lastName"
            placeholder={t("Write the LastName here please")}
            {...register("lastName", {
              required: { value: true, message: `${t("LastName is required")}` },
              minLength: {
                value: 3,
                message: `${t("LastName cannot be less than 3 character")}`,
              },
            })}
            className={"form-field" + (errors.lastName ? " has-error" : "")}
          />
          {errors.lastName && (
            <FormText className="error-label">
              {errors.lastName.message}
            </FormText>
          )}
        </FormGroup>
        <FormGroup>
          <Label for="email">{t("Email")}</Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder={t("Write the email here please")}
            {...register("email", {
              required: { value: true, message: `${t("Email is required")}` },
              minLength: {
                value: 3,
                message: `${t("Email cannot be less than 3 character")}`,
              },
            })}
            className={"form-field" + (errors.email ? " has-error" : "")}
          />
          {errors.email && (
            <FormText className="error-label">{errors.email.message}</FormText>
          )}
        </FormGroup>
        <Button type="submit" color="primary mt-1">
          {t("Send")}
        </Button>
      </Form>
    </Container>
    </div>
  );
};

export default FormProfessional;
