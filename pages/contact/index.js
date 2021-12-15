import React from "react";
import useTranslation from "next-translate/useTranslation";
import Layout from "../../components/Layout/Layout";
import { Button, Form, FormGroup, Row, Col } from "react-bootstrap";
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
      <section className="container content">
        <Row className="d-flex justify-content-center">
          <Col xs={6}>
            <b><p>hola@lafabricadeproyectos.com.ar</p>
            <p>+54 9 2314 616681</p></b>
            <Form>
              <FormGroup>
                <Form.Label htmlFor="name">{t("common:name")}</Form.Label>
                <Form.Control
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
                  <Form.Text variant="danger" className="error-label">
                    {errors.name.message}
                  </Form.Text>
                )}
              </FormGroup>
              <FormGroup>
                <Form.Label htmlFor="email">{t("common:email")}</Form.Label>
                <Form.Control
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
                  <Form.Text variant="danger" className="error-label">
                    {errors.email.message}
                  </Form.Text>
                )}
              </FormGroup>
              <FormGroup>
                <Form.Label htmlFor="phone">{t("phone")}</Form.Label>
                <Form.Control
                  type="phone"
                  name="phone"
                  id="phone"
                  placeholder={t("write-your-phone-here")}
                />
              </FormGroup>
              <FormGroup>
                <Form.Label htmlFor="message">{t("message")}</Form.Label>
                <Form.Control type="textarea" name="text" id="exampleText" placeholder={t("write-your-message-here")}/>
              </FormGroup>
              <Button type="submit" variant="dark" className="mt-2">
                {t("common:send")}
              </Button>
            </Form>
          </Col>
        </Row>
      </section>
    </Layout>
  );
};

export default ContactUs;
