import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/client";
import { useForm, Controller } from "react-hook-form";
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
import Select from "react-select";
import Dropzone from "./Dropzone";

const FormProject = ({ onAddProject, professionals, toggle }) => {
  const [session, loading] = useSession();
  const [options, setOptions] = useState([]);

  const [previewImage, setPreviewImage] = useState([]);
  const [images, setImages] = useState([]);
  const [file, setFile] = useState([]);

  const { t, lang } = useTranslation("common");

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  useEffect(async () => {
    setOptions(professionals);
  }, [professionals]);

  const onSubmit = async (
    { name, description, totalArea, website, year, professionalsSelected },
    event
  ) => {
    // You should handle login logic with name, description, totalArea, website, year, professional selected, preview image for form data
    let data = {
      name,
      description,
      totalArea,
      website,
      year,
      previewImage,
      images,
      file,
    };
    let id = professionalsSelected.id;
    onAddProject(data, id);
    event.target.reset();
    toggle();
  };

  return (
    <Container fluid="sm">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label for="name">{t("Name")}</Label>
          <Input
            type="text"
            id="name"
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
            <FormText className="invalid error-label">
              {errors.name.message}
            </FormText>
          )}
        </FormGroup>
        <FormGroup>
          <Label for="description">{t("Description")}</Label>
          <Input
            type="text"
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
          <Label for="email">{t("Write the website")}</Label>
          <Input
            type="email"
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
        <Row>
          <Col xs={6}>
            <FormGroup>
              <Label for="totalArea">{t("Total Area")}</Label>
              <Input
                type="number"
                id="totalArea"
                placeholder={t("Write the Total Area here please")}
                {...register("totalArea", {
                  required: {
                    value: true,
                    message: `${t("Total Area is required")}`,
                  },
                  minLength: {
                    value: 3,
                    message: `${t(
                      "Total Area cannot be less than 3 character"
                    )}`,
                  },
                })}
                className={
                  "form-field" + (errors.totalArea ? " has-error" : "")
                }
              />
              {errors.totalArea && (
                <FormText className="error-label">
                  {errors.totalArea.message}
                </FormText>
              )}
            </FormGroup>
          </Col>
          <Col xs={6}>
            <FormGroup>
              <Label for="year">{t("Year")}</Label>
              <Input
                type="number"
                id="year"
                placeholder={t("Write the Year here please")}
                {...register("year", {
                  required: {
                    value: true,
                    message: `${t("Year is required")}`,
                  },
                  minLength: {
                    value: 3,
                    message: `${t("Year cannot be less than 3 character")}`,
                  },
                })}
                className={"form-field" + (errors.year ? " has-error" : "")}
              />
              {errors.year && (
                <FormText className="error-label">
                  {errors.year.message}
                </FormText>
              )}
            </FormGroup>
          </Col>
        </Row>

        <FormGroup>
          <Controller
            name="professionalsSelected"
            control={control}
            rules={{
              required: {
                value: true,
                message: `${t("professionalsSelected is required")}`,
              },
            }}
            render={({ field }) => (
              <Select
                {...field}
                inputId={"professionalsSelected"}
                options={options}
                getOptionLabel={(option) =>
                  `${option?.firstName} ${option?.lastName}`
                }
                getOptionValue={(option) => `${option?.id}`}
                isClearable
              />
            )}
          />
          {errors.professionalsSelected && (
            <FormText className="error-label">
              {errors.professionalsSelected.message}
            </FormText>
          )}
        </FormGroup>
        <FormGroup>
          <Label for="filePreview">
            {t("Select preview image for project")}
          </Label>
          <Dropzone
            newFiles={previewImage}
            setFile={setPreviewImage}
            accept={"image/*"}
            multiple={false}
            name={"previewImage"}
          />
        </FormGroup>
        <FormGroup>
          <Label for="uploadFiles">{t("Upload images")}</Label>
          <Dropzone
            newFiles={images}
            setFile={setImages}
            accept={"image/*"}
            multiple={true}
            name={"images"}
          />
        </FormGroup>
        <FormGroup>
          <Label>{t("Upload Files")}</Label>
          <br></br>
          <Dropzone
            newFiles={file}
            setFile={setFile}
            accept={"application/x-zip-compressed, application/zip"}
            multiple={false}
            name={"file"}
          />
        </FormGroup>
        <Button type="submit" color="primary mt-1">
          {t("Send")}
        </Button>
      </Form>
    </Container>
  );
};

export default FormProject;
