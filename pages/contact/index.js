import React from "react";
import useTranslation from "next-translate/useTranslation";
import Layout from "../../components/Layout/Layout";
import { Button, Form, FormGroup, Label, Input, FormText, Row, Col } from "reactstrap";
import { useForm } from "react-hook-form";

const ContactUs = () => {
  const { t } = useTranslation("contact");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  return (
    <Layout title={`${t("common:contact")}`}>
      <Row className="d-flex justify-content-center">
        <Col xs={6}>
          <b><p>hola@fabricadeproyectos.com</p>
          <p>+54 9 11 4545 4545</p></b>
          <Form>
            <FormGroup>
              <Label for="name">{t("common:name")}</Label>
              <Input
                type="text"
                id="name"
                placeholder={t("common:write-the-here-please", {
                  namePlaceholder: t("common:the-name").toLowerCase(),
                })}
                {...register("name", {
                  required: {
                    value: true,
                    message: `${t("common:is-required", {
                      nameRequired: t("common:the-name"),
                    })}`,
                  },
                  minLength: {
                    value: 3,
                    message: `${t("common:cannot-be-less-than-character", {
                      nameInput: t("common:the-name"),
                      numberCharacters: 3,
                    })}`,
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
              <Label for="email">{t("common:email")}</Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder={t("common:write-the-here-please", {
                  namePlaceholder: t("common:the-email").toLowerCase(),
                })}
                {...register("email", {
                  required: {
                    value: true,
                    message: `${t("common:is-required", {
                      nameRequired: t("common:the-email"),
                    })}`,
                  },
                  minLength: {
                    value: 3,
                    message: `${t("common:cannot-be-less-than-character", {
                      nameInput: t("common:the-email"),
                      numberCharacters: 3,
                    })}`,
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
              <Label for="phone">{t("phone")}</Label>
              <Input
                type="phone"
                name="phone"
                id="phone"
                placeholder={t("write-your-phone-here")}
              />
            </FormGroup>
            <FormGroup>
              <Label for="message">{t("message")}</Label>
              <Input type="textarea" name="text" id="exampleText" placeholder={t("write-your-message-here")}/>
            </FormGroup>
            <Button type="submit" color="dark" className="mt-2">
              {t("common:send")}
            </Button>
          </Form>
        </Col>
      </Row>
    </Layout>
  );
};

export default ContactUs;
