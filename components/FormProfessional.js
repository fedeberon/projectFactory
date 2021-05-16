import React from "react";
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

const FormProfessional = ({onAddProfessional}) => {

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
    <Container fluid="sm">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col>
            <h3 className="form-header">FORM PROFESSIONAL</h3>
          </Col>
        </Row>
        <FormGroup>
          <Label for="firstName">FirstName</Label>
          <Input
            type="text"
            name="firstName"
            id="firstName"
            placeholder="write the name here please"
            {...register("firstName", {
              required: { value: true, message: "FirstName is required" },
              minLength: {
                value: 3,
                message: "FirstName cannot be less than 3 character",
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
          <Label for="lastName">LastName</Label>
          <Input
            type="text"
            name="lastName"
            id="lastName"
            placeholder="write the LastName here please"
            {...register("lastName", {
              required: { value: true, message: "LastName is required" },
              minLength: {
                value: 3,
                message: "LastName cannot be less than 3 character",
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
          <Label for="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="with a placeholder"
            {...register("email", {
              required: { value: true, message: "Email is required" },
              minLength: {
                value: 3,
                message: "Email cannot be less than 3 character",
              },
            })}
            className={"form-field" + (errors.email ? " has-error" : "")}
          />
          {errors.email && (
            <FormText className="error-label">{errors.email.message}</FormText>
          )}
        </FormGroup>
        <Button type="submit" color="primary">
          Enviar
        </Button>
      </Form>
    </Container>
  );
};

export default FormProfessional;
