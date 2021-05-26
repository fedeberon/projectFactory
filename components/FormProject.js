import React from "react";
import { useSession } from "next-auth/client";
import { useForm } from "react-hook-form";
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
import { useTranslation } from "react-i18next";

const FormProject = ({ onAddProject, toggle }) => {
  const [session, loading] = useSession();

  const { t, lang } = useTranslation("common");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async (
    { name, description, totalArea, website, year },
    event
  ) => {
    // You should handle login logic with name, description, totalArea, website and year form data
    let data = {
      name,
      description,
      totalArea,
      website,
      year,
    };
    onAddProject(data);
    event.target.reset();
  };

  return (
    <Container fluid="sm">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col>
            <h3 className="form-header">{t("FORM PROJECT")}</h3>
          </Col>
        </Row>
        <FormGroup>
          <Label for="name">{t("Name")}</Label>
          <Input
            type="text"
            name="name"
            id="name"
            placeholder={t("Write the name here please")}
            {...register("name", {
              required: { value: true, message: `${t("Name is required")}` },
              minLength: {
                value: 3,
                message: `${t("Name cannot be less than 3 character")}`,
              },
            })}
            className={"form-field" + (errors.name ? " has-error" : "")}
          />
          {errors.name && (
            <FormText className="invalid error-label">{errors.name.message}</FormText>
          )}
        </FormGroup>
        <FormGroup>
          <Label for="description">{t("Description")}</Label>
          <Input
            type="text"
            name="description"
            id="description"
            placeholder={t("Write the description here please")}
            {...register("description", {
              required: { value: true, message: `${t("Description is required")}` },
              minLength: {
                value: 3,
                message: `${t("Description cannot be less than 3 character")}`,
              },
            })}
            className={"form-field" + (errors.description ? " has-error" : "")}
          />
          {errors.description && (
            <FormText className="error-label">
              {errors.description.message}
            </FormText>
          )}
        </FormGroup>
        <FormGroup>
          <Label for="totalArea">{t("Total Area")}</Label>
          <Input
            type="number"
            name="totalArea"
            id="totalArea"
            placeholder={t("Write the Total Area here please")}
            {...register("totalArea", {
              required: { value: true, message: `${t("Total Area is required")}` },
              minLength: {
                value: 3,
                message: `${t("Total Area cannot be less than 3 character")}`,
              },
            })}
            className={"form-field" + (errors.totalArea ? " has-error" : "")}
          />
          {errors.totalArea && (
            <FormText className="error-label">
              {errors.totalArea.message}
            </FormText>
          )}
        </FormGroup>
        <FormGroup>
          <Label for="email">{t("Email")}</Label>
          <Input
            type="email"
            name="website"
            id="email"
            placeholder={t("Write the email here please")}
            {...register("website", {
              required: { value: true, message: `${t("Email is required")}` },
              minLength: {
                value: 3,
                message: `${t("Email cannot be less than 3 character")}`,
              },
            })}
            className={"form-field" + (errors.website ? " has-error" : "")}
          />
          {errors.website && (
            <FormText className="error-label">
              {errors.website.message}
            </FormText>
          )}
        </FormGroup>
        <FormGroup>
          <Label for="year">{t("Year")}</Label>
          <Input
            type="number"
            name="year"
            id="year"
            placeholder={t("Write the Year here please")}
            {...register("year", {
              required: { value: true, message: `${t("Year is required")}` },
              minLength: {
                value: 3,
                message: `${t("Year cannot be less than 3 character")}`,
              },
            })}
            className={"form-field" + (errors.year ? " has-error" : "")}
          />
          {errors.year && (
            <FormText className="error-label">{errors.year.message}</FormText>
          )}
        </FormGroup>
        <Button type="submit" color="primary mt-1" onClick={toggle}>
          {t("Send")}
        </Button>
      </Form>
    </Container>
  );
};

export default FormProject;
