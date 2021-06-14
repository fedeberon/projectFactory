import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import InputImages from "../components/InputImages/InputImages";
import Dropzone from "../components/Dropzone";
import * as youtubeService from "../services/youtubeService";

const FormEditProject = ({ project, onEdit, toggle }) => {
  const [previewImage, setPreviewImage] = useState([]);
  const [images, setImages] = useState([]);
  const [imagesEdited, setImagesEdited] = useState([]);

  const { t, lang } = useTranslation("common");

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      name: project.name,
      description: project.description,
      totalArea: project.totalArea,
      website: project.website,
      year: project.year,
      videoPath: youtubeService.getLinkToId(project.videoPath)
    },
  });

  useEffect(() => {
    if (project) {
      setImages(Array.from(project.images));
    }
  }, [project]);

  const onSubmit = async (
    { name, description, totalArea, website, year, videoPath },
    event
  ) => {
    if (youtubeService.isValidVideo(videoPath)) {
      // You should handle login logic with name, description, totalArea, website, year, professional selected, preview image for form data
      let image;
      previewImage.length == 0 ? (image = undefined) : (image = previewImage[0]);
      let data = {
        name,
        description,
        totalArea,
        website,
        year,
        previewImage: image,
        imagesEdited,
        videoPath,
        id: project.id,
      };
      onEdit(data);
      event.target.reset();
      toggle();
    } else {
      setError("videoPath",{
        type: "manual",
        message: t("InvalidLink")
      });
    }
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
          <Controller
            name="name"
            control={control}
            rules={{
              required: {
                value: true,
                message: `${t("Name is required")}`,
              },
              minLength: {
                value: 3,
                message: `${t("Name cannot be less than 3 character")}`,
              },
            }}
            defaultValue=""
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                id="name"
                placeholder={t("Write the name here please")}
                className={"form-field" + (errors.name ? " has-error" : "")}
              />
            )}
          />
          {errors.name && (
            <FormText className="invalid error-label">
              {errors.name.message}
            </FormText>
          )}
        </FormGroup>
        <FormGroup>
          <Label for="description">{t("Description")}</Label>
          <Controller
            name="description"
            control={control}
            rules={{
              required: {
                value: true,
                message: `${t("Description is required")}`,
              },
              minLength: {
                value: 3,
                message: `${t("Description cannot be less than 3 character")}`,
              },
            }}
            defaultValue=""
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                id="description"
                placeholder={t("Write the description here please")}
                className={
                  "form-field" + (errors.description ? " has-error" : "")
                }
              />
            )}
          />
          {errors.description && (
            <FormText className="error-label">
              {errors.description.message}
            </FormText>
          )}
        </FormGroup>
        <FormGroup>
          <Label for="totalArea">{t("Total Area")}</Label>
          <Controller
            name="totalArea"
            control={control}
            rules={{
              required: {
                value: true,
                message: `${t("Total Area is required")}`,
              },
              minLength: {
                value: 3,
                message: `${t("Total Area cannot be less than 3 character")}`,
              },
            }}
            defaultValue=""
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                id="totalArea"
                placeholder={t("Write the Total Area here please")}
                className={
                  "form-field" + (errors.totalArea ? " has-error" : "")
                }
              />
            )}
          />
          {errors.totalArea && (
            <FormText className="error-label">
              {errors.totalArea.message}
            </FormText>
          )}
        </FormGroup>
        <FormGroup>
          <Label for="email">{t("WebSite")}</Label>
          <Controller
            name="website"
            control={control}
            rules={{
              required: { value: true, message: `${t("WebSite is required")}` },
              minLength: {
                value: 3,
                message: `${t("WebSite cannot be less than 3 character")}`,
              },
            }}
            defaultValue=""
            render={({ field }) => (
              <Input
                {...field}
                type="email"
                id="email"
                placeholder={t("Write the website here please")}
                className={"form-field" + (errors.website ? " has-error" : "")}
              />
            )}
          />
          {errors.website && (
            <FormText className="error-label">
              {errors.website.message}
            </FormText>
          )}
        </FormGroup>
        <FormGroup>
          <Label for="year">{t("Year")}</Label>
          <Controller
            name="year"
            control={control}
            rules={{
              required: { value: true, message: `${t("Year is required")}` },
              minLength: {
                value: 3,
                message: `${t("Year cannot be less than 3 character")}`,
              },
            }}
            defaultValue=""
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                id="year"
                placeholder={t("Write the Year here please")}
                className={"form-field" + (errors.year ? " has-error" : "")}
              />
            )}
          />
          {errors.year && (
            <FormText className="error-label">{errors.year.message}</FormText>
          )}
        </FormGroup>
        <FormGroup>
        <Label for="videoPath">{t("WriteVideoPath")}</Label>
          <Controller
            name="videoPath"
            control={control}
            rules={{
              required: {
                value: true,
                message: `${t("VideoPathIsRequired")}`,
              },
              minLength: {
                value: 3,
                message: `${t("VideoPathInvalid")}`,
              },
            }}
            defaultValue=""
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                id="videoPath"
                placeholder={t("WriteVideoPathPlease")}
                className={"form-field" + (errors.videoPath ? " has-error" : "")}
              />
            )}
          />
          {errors.videoPath && (
            <FormText className="invalid error-label">
              {errors.videoPath.message}
            </FormText>
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
            images={images}
            accept={"image/*"}
            multiple={true}
            withTags={true}
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
