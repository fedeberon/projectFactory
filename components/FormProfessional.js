import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Button,
  Container,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
} from "reactstrap";
import InputImages from "../components/InputImages/InputImages";
import Dropzone from "../components/Dropzone";
import ModalForm from "../components/ModalForm";
import FormTag from "../components/FormTag/FormTag";
import Error from "./Error";

const FormProfessional = ({ onAddProfessional, toggle, error, setError }) => {
  const { t, lang } = useTranslation("common");
  const [previewImage, setPreviewImage] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState([]);
  const [images, setImages] = useState([]);
  const [modalTagOpen, setModalTagOpen] = useState(false);
  const [currentImageTag, setCurrentImageTag] = useState({});

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async ({ firstName, lastName, email }, event) => {
    // You should handle login logic with firstName, lastName, email, preview and background images and form data
    let data = {
      firstName,
      lastName,
      email,
      images,
      previewImage: previewImage[0],
      backgroundImage: backgroundImage[0],
    };
    const professional = await onAddProfessional(data);

    if (professional != null) {
      setPreviewImage(null);
      setBackgroundImage(null);
      event.target.reset();
      toggle();
      setError("");
    }
  };

  const toggleTagModal = () => setModalTagOpen(!modalTagOpen);

  const showTagModal = (img) => {
    setModalTagOpen(true);
    setCurrentImageTag(img);
  };

  return (
    <div>
      <Container fluid="sm">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label for="firstName">{t("FirstName")}</Label>
            <Input
              type="text"
              name="firstName"
              id="firstName"
              placeholder={t("Write the name here please")}
              {...register("firstName", {
                required: {
                  value: true,
                  message: `${t("FirstName is required")}`,
                },
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
                required: {
                  value: true,
                  message: `${t("LastName is required")}`,
                },
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
              <FormText className="error-label">
                {errors.email.message}
              </FormText>
            )}
          </FormGroup>
          <FormGroup>
            <Label for="file">{t("Select profile picture")}</Label>
            <Dropzone
              newFiles={previewImage}
              setFile={setPreviewImage}
              accept={"image/*"}
              multiple={false}
              name={"images"}
            />
          </FormGroup>
          <FormGroup>
            <Label for="file">{t("Select background picture")}</Label>
            <Dropzone
              newFiles={backgroundImage}
              setFile={setBackgroundImage}
              accept={"image/*"}
              multiple={false}
              name={"images"}
            />
          </FormGroup>
          <FormGroup>
            <Label for="uploadFiles">{t("Upload images")}</Label>
            <InputImages
              accept={"image/*"}
              multiple={true}
              imagesEdited={setImages}
              withTags={true}
              onAdd={showTagModal}
            />
          </FormGroup>
          <Button type="submit" color="primary mt-1">
            {t("Send")}
          </Button>
        </Form>

        <ModalForm
          className={"Button"}
          modalTitle={t("AddTags")}
          formBody={
            <FormTag
              image={currentImageTag}
              toggle={toggleTagModal}
            />
          }
          modalOpen={{ open: modalTagOpen, function: setModalTagOpen }}
        />
        {error && <Error error={error} />}
      </Container>
    </div>
  );
};

export default FormProfessional;
