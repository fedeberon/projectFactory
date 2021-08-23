import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Row,
} from "react-bootstrap";
import useTranslation from "next-translate/useTranslation";
import InputImages from "../components/InputImages/InputImages";
import Dropzone from "../components/Dropzone/Dropzone";
import * as youtubeService from "../services/youtubeService";
import FormTag from "../components/FormTag/FormTag";
import ModalForm from "../components/ModalForm";

const FormEditProject = ({ project, onEdit, toggle }) => {
  const [previewImage, setPreviewImage] = useState([]);
  const [images, setImages] = useState([]);
  const [imagesEdited, setImagesEdited] = useState([]);
  const [currentImageTag, setCurrentImageTag] = useState({});
  const [modalTagOpen, setModalTagOpen] = useState(false);
  const toggleTagModal = () => setModalTagOpen(!modalTagOpen);

  const { t } = useTranslation("common");

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
      videoPath: youtubeService.getLinkToId(project.videoPath),
    },
  });

  useEffect(() => {
    if (project) {
      setImages(Array.from(project.images));
    }
  }, [project]);

  const onClickAddTag = (image) => {
    setCurrentImageTag(image);
    toggleTagModal();
  };

  const imagesHasTags = () => {
    const imagesWithoutTags = images.filter((img) => img.tags.length == 0);
    return imagesWithoutTags.length == 0;
  };

  const onSubmit = async (
    { name, description, totalArea, website, year, videoPath },
    event
  ) => {
    // You should handle login logic with name, description, totalArea, website, year, professional selected, preview image for form data
    if (youtubeService.isValidVideo(videoPath)) {
      if (imagesHasTags()) {
        let image;
        previewImage.length == 0
          ? (image = undefined)
          : (image = previewImage[0]);
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
      }
    } else {
      setError("videoPath", {
        type: "manual",
        message: t("invalid-link"),
      });
    }
  };

  return (
    <Container fluid="sm">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col>
            <h3 className="form-header">{t("project-edition-form")}</h3>
          </Col>
        </Row>
        <FormGroup>
          <Form.Label htmlFor="name">{t("name")}</Form.Label>
          <Controller
            name="name"
            control={control}
            rules={{
              required: {
                value: true,
                message: `${t("is-required", {
                  nameRequired: t("the-name"),
                })}`,
              },
              minLength: {
                value: 3,
                message: `${t("cannot-be-less-than-character", {
                  nameInput: t("the-name"),
                  numberCharacters: 3,
                })}`,
              },
            }}
            defaultValue=""
            render={({ field }) => (
              <Form.Control
                {...field}
                type="text"
                id="name"
                placeholder={t("write-the-here-please", {
                  namePlaceholder: t("the-name").toLowerCase(),
                })}
                className={"form-field" + (errors.name ? " has-error" : "")}
              />
            )}
          />
          {errors.name && (
            <Form.Text variant="danger" className="invalid error-label">
              {errors.name.message}
            </Form.Text>
          )}
        </FormGroup>
        <FormGroup>
          <Form.Label htmlFor="description">{t("description")}</Form.Label>
          <Controller
            name="description"
            control={control}
            rules={{
              required: {
                value: true,
                message: `${t("is-required", {
                  nameRequired: t("the-description"),
                })}`,
              },
              minLength: {
                value: 3,
                message: `${t("cannot-be-less-than-character", {
                  nameInput: t("the-description"),
                  numberCharacters: 3,
                })}`,
              },
            }}
            defaultValue=""
            render={({ field }) => (
              <Form.Control
                {...field}
                type="text"
                id="description"
                placeholder={t("write-the-here-please", {
                  namePlaceholder: t("the-description").toLowerCase(),
                })}
                className={
                  "form-field" + (errors.description ? " has-error" : "")
                }
              />
            )}
          />
          {errors.description && (
            <Form.Text variant="danger" className="error-label">
              {errors.description.message}
            </Form.Text>
          )}
        </FormGroup>
        <FormGroup>
          <Form.Label htmlFor="totalArea">{t("total-area")}</Form.Label>
          <Controller
            name="totalArea"
            control={control}
            rules={{
              required: {
                value: true,
                message: `${t("is-required", {
                  nameRequired: t("the-total-area"),
                })}`,
              },
              minLength: {
                value: 3,
                message: `${t("cannot-be-less-than-character", {
                  nameInput: t("the-total-area"),
                  numberCharacters: 3,
                })}`,
              },
            }}
            defaultValue=""
            render={({ field }) => (
              <Form.Control
                {...field}
                type="number"
                id="totalArea"
                placeholder={t("write-the-here-please", {
                  namePlaceholder: t("the-total-area").toLowerCase(),
                })}
                className={
                  "form-field" + (errors.totalArea ? " has-error" : "")
                }
              />
            )}
          />
          {errors.totalArea && (
            <Form.Text variant="danger" className="error-label">
              {errors.totalArea.message}
            </Form.Text>
          )}
        </FormGroup>
        <FormGroup>
          <Form.Label htmlFor="email">{t("web-site")}</Form.Label>
          <Controller
            name="website"
            control={control}
            rules={{
              required: {
                value: true,
                message: `${t("is-required", {
                  nameRequired: t("the-web-site"),
                })}`,
              },
              minLength: {
                value: 3,
                message: `${t("cannot-be-less-than-character", {
                  nameInput: t("the-web-site"),
                  numberCharacters: 3,
                })}`,
              },
            }}
            defaultValue=""
            render={({ field }) => (
              <Form.Control
                {...field}
                type="email"
                id="email"
                placeholder={t("write-the-here-please", {
                  namePlaceholder: t("the-web-site").toLowerCase(),
                })}
                className={"form-field" + (errors.website ? " has-error" : "")}
              />
            )}
          />
          {errors.website && (
            <Form.Text variant="danger" className="error-label">
              {errors.website.message}
            </Form.Text>
          )}
        </FormGroup>
        <FormGroup>
          <Form.Label htmlFor="year">{t("year")}</Form.Label>
          <Controller
            name="year"
            control={control}
            rules={{
              required: {
                value: true,
                message: `${t("is-required", {
                  nameRequired: t("the-year"),
                })}`,
              },
              minLength: {
                value: 3,
                message: `${t("cannot-be-less-than-character", {
                  nameInput: t("the-year"),
                  numberCharacters: 3,
                })}`,
              },
            }}
            defaultValue=""
            render={({ field }) => (
              <Form.Control
                {...field}
                type="number"
                id="year"
                placeholder={t("write-the-here-please", {
                  namePlaceholder: t("the-year").toLowerCase(),
                })}
                className={"form-field" + (errors.year ? " has-error" : "")}
              />
            )}
          />
          {errors.year && (
            <Form.Text variant="danger" className="error-label">
              {errors.year.message}
            </Form.Text>
          )}
        </FormGroup>
        <FormGroup>
          <Form.Label htmlFor="videoPath">{t("video-path")}</Form.Label>
          <Controller
            name="videoPath"
            control={control}
            rules={{
              required: {
                value: true,
                message: `${t("is-required", {
                  nameRequired: t("the-video-path"),
                })}`,
              },
              minLength: {
                value: 3,
                message: `${t("cannot-be-less-than-character", {
                  nameInput: t("the-video-path"),
                  numberCharacters: 3,
                })}`,
              },
            }}
            defaultValue=""
            render={({ field }) => (
              <Form.Control
                {...field}
                type="text"
                id="videoPath"
                placeholder={t("write-the-here-please", {
                  namePlaceholder: t("the-video-path").toLowerCase(),
                })}
                className={
                  "form-field" + (errors.videoPath ? " has-error" : "")
                }
              />
            )}
          />
          {errors.videoPath && (
            <Form.Text variant="danger" className="invalid error-label">
              {errors.videoPath.message}
            </Form.Text>
          )}
        </FormGroup>
        <FormGroup>
          <Form.Label htmlFor="filePreview">
            {t("select-preview-image-for-project")}
          </Form.Label>
          <br></br>
          <Dropzone
            newFiles={previewImage}
            setFile={setPreviewImage}
            accept={"image/*"}
            multiple={false}
            name={"filePreview"}
            height={"90px"}
          />
        </FormGroup>
        <FormGroup>
          <Form.Label htmlFor="uploadFiles">{t("upload-images")}</Form.Label>
          <br></br>
          <InputImages
            images={images}
            accept={"image/*"}
            onAdd={onClickAddTag}
            multiple={true}
            withTags={true}
            imagesEdited={setImagesEdited}
          />
        </FormGroup>
        <Button type="submit" variant="primary">
          {t("send")}
        </Button>
      </Form>

      <ModalForm
        size={"xl"}
        className={"Button"}
        modalTitle={t("add-tags")}
        formBody={<FormTag image={currentImageTag} toggle={toggleTagModal} />}
        modalOpen={{ open: modalTagOpen, function: setModalTagOpen }}
      />
    </Container>
  );
};

export default FormEditProject;
