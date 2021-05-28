import React, { useEffect, useState } from "react";
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
import InputImages from "../components/InputImages";
import Dropzone from "../components/Dropzone";

const FormEditProject = ({ project, onEdit, toggle }) => {
  const [previewImage, setPreviewImage] = useState([]);
  const [images, setImages] = useState([]);
  const [imagesEdited, setImagesEdited] = useState([]);

  useEffect(() => {
    if (project) {
      setImages(Array.from(project.images));
    }
  }, [project]);

  const { t, lang } = useTranslation("common");

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async (
    { name, description, totalArea, website, year },
    event
  ) => {
    // You should handle login logic with name, description, totalArea, website, year, professional selected, preview image for form data
    let image;
    previewImage.length == 0 ? image= undefined : image = previewImage[0];
    let data = {
      name,
      description,
      totalArea,
      website,
      year,
      previewImage: image,
      imagesEdited,
      id: project.id,
    };
    onEdit(data);
    event.target.reset();
    toggle();
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
            defaultValue={project.name}
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
            <FormText className="invalid error-label">
              {errors.name.message}
            </FormText>
          )}
        </FormGroup>
        <FormGroup>
          <Label for="description">{t("Description")}</Label>
          <Input
            type="text"
            name="description"
            defaultValue={project.description}
            id="description"
            placeholder={t("Write the description here please")}
            {...register("description", {
              required: {
                value: true,
                message: `${t("Description is required")}`,
              },
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
            defaultValue={project.totalArea}
            id="totalArea"
            placeholder={t("Write the Total Area here please")}
            {...register("totalArea", {
              required: {
                value: true,
                message: `${t("Total Area is required")}`,
              },
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
          <Label for="email">{t("WebSite")}</Label>
          <Input
            type="email"
            name="website"
            defaultValue={project.website}
            id="email"
            placeholder={t("Write the website here please")}
            {...register("website", {
              required: { value: true, message: `${t("WebSite is required")}` },
              minLength: {
                value: 3,
                message: `${t("WebSite cannot be less than 3 character")}`,
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
            defaultValue={project.year}
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
        <FormGroup>
          <Label for="filePreview">
            {t("Select preview image for project")}
          </Label>
          <br></br>
          <Dropzone
            setFile={setPreviewImage}
            accept={"image/*"}
            multiple={false}
            name={"filePreview"}
          />
        </FormGroup>
        <FormGroup>
          <Label for="uploadFiles">{t("Upload images")}</Label>
          <br></br>
          <InputImages
            setImages={setImages}
            images={images}
            accept={"image/*"}
            multiple={true}
            imagesEdited={setImagesEdited}
          />
        </FormGroup>
        <Button type="submit" color="primary">
          {t("Send")}
        </Button>
      </Form>
    </Container>
  );
};

export default FormEditProject;
