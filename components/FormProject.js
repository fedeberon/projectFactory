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

const FormProject = ({ onAddProject }) => {
  const [session, loading] = useSession();

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
    onAddProject();
    event.target.reset();
  };

  return (
    <Container fluid="sm">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col>
            <h3 className="form-header">FORM PROJECT</h3>
          </Col>
        </Row>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            type="text"
            name="name"
            id="name"
            placeholder="write the name here please"
            {...register("name", {
              required: { value: true, message: "Name is required" },
              minLength: {
                value: 3,
                message: "Name cannot be less than 3 character",
              },
            })}
            className={"form-field" + (errors.name ? " has-error" : "")}
          />
          {errors.name && (
            <FormText className="invalid error-label">{errors.name.message}</FormText>
          )}
        </FormGroup>
        <FormGroup>
          <Label for="description">Description</Label>
          <Input
            type="text"
            name="description"
            id="description"
            placeholder="write the description here please"
            {...register("description", {
              required: { value: true, message: "Description is required" },
              minLength: {
                value: 3,
                message: "Description cannot be less than 3 character",
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
          <Label for="totalArea">TotalArea</Label>
          <Input
            type="number"
            name="totalArea"
            id="totalArea"
            placeholder="write the totalArea here please"
            {...register("totalArea", {
              required: { value: true, message: "TotalArea is required" },
              minLength: {
                value: 3,
                message: "TotalArea cannot be less than 3 character",
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
          <Label for="email">Email</Label>
          <Input
            type="email"
            name="website"
            id="email"
            placeholder="with a placeholder"
            {...register("website", {
              required: { value: true, message: "Email is required" },
              minLength: {
                value: 3,
                message: "Email cannot be less than 3 character",
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
          <Label for="year">Year</Label>
          <Input
            type="number"
            name="year"
            id="year"
            placeholder="write the Year here please"
            {...register("year", {
              required: { value: true, message: "Year is required" },
              minLength: {
                value: 3,
                message: "Year cannot be less than 3 character",
              },
            })}
            className={"form-field" + (errors.year ? " has-error" : "")}
          />
          {errors.year && (
            <FormText className="error-label">{errors.year.message}</FormText>
          )}
        </FormGroup>
        <Button type="submit" color="primary">
          Enviar
        </Button>
      </Form>
    </Container>
  );
};

export default FormProject;
