import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/client";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Row,
} from "react-bootstrap";
import useTranslation from "next-translate/useTranslation";
import Select from "react-select";
import Dropzone from "./Dropzone/Dropzone";
import * as youtubeService from "../services/youtubeService";
import InputImages from "../components/InputImages/InputImages";
import FormTag from "../components/FormTag/FormTag";
import ModalForm from "../components/ModalForm";

const FormProject = ({ onAddProject, toggle }) => {
  const [session, loading] = useSession();
  const [options, setOptions] = useState([]);

  const [previewImage, setPreviewImage] = useState([]);
  const [images, setImages] = useState([]);
  const [file, setFile] = useState([]);
  const [modalTagOpen, setModalTagOpen] = useState(false);
  const [currentImageTag, setCurrentImageTag] = useState({});

  const { t } = useTranslation("common");

  const {
    control,
    register,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const toggleTagModal = () => setModalTagOpen(!modalTagOpen);
  const showTagModal = (img) => {
    setModalTagOpen(true);
    setCurrentImageTag(img);
  };

  const onSubmit = async (
    {
      name,
      description,
      totalArea,
      website,
      year,
      videoPath,
      price,
    },
    event
  ) => {
    if (youtubeService.isValidVideo(videoPath)) {
      // You should handle login logic with name, description, totalArea, website, year, preview image, video path for form data
      let data = {
        name,
        description,
        totalArea,
        website,
        year,
        previewImage: previewImage[0],
        images,
        file: file[0],
        videoPath,
        price,
      };
      await onAddProject(data);
      event.target.reset();
      toggle();
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
        <Row className="row-cols-1 row-cols-md-2 g-3">
          <Col>
            <FormGroup>
              <Form.Label htmlFor="name">{t("name")}</Form.Label>
              <Form.Control
                type="text"
                id="name"
                placeholder={t("write-the-here-please", {
                  namePlaceholder: t("the-name").toLowerCase(),
                })}
                {...register("name", {
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
                })}
                className={"form-field" + (errors.name ? " has-error" : "")}
              />
              {errors.name && (
                <Form.Text variant="danger" className="invalid error-label">
                  {errors.name.message}
                </Form.Text>
              )}
            </FormGroup>
            <FormGroup>
              <Form.Label htmlFor="description">{t("description")}</Form.Label>
              <Form.Control
                type="text"
                id="description"
                placeholder={t("write-the-here-please", {
                  namePlaceholder: t("the-description").toLowerCase(),
                })}
                {...register("description", {
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
                })}
                className={
                  "form-field" + (errors.description ? " has-error" : "")
                }
              />
              {errors.description && (
                <Form.Text variant="danger" className="error-label">
                  {errors.description.message}
                </Form.Text>
              )}
            </FormGroup>

            <FormGroup>
              <Form.Label htmlFor="email">{t("write-the-web-site")}</Form.Label>
              <Form.Control
                type="email"
                id="email"
                placeholder={t("write-the-here-please", {
                  namePlaceholder: t("the-web-site").toLowerCase(),
                })}
                {...register("website", {
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
                })}
                className={"form-field" + (errors.website ? " has-error" : "")}
              />
              {errors.website && (
                <Form.Text variant="danger" className="error-label">
                  {errors.website.message}
                </Form.Text>
              )}
            </FormGroup>
            <Row>
              <Col xs={6}>
                <FormGroup>
                  <Form.Label htmlFor="totalArea">{t("total-area")}</Form.Label>
                  <Form.Control
                    type="number"
                    id="totalArea"
                    placeholder={t("write-the-here-please", {
                      namePlaceholder: t("the-total-area").toLowerCase(),
                    })}
                    {...register("totalArea", {
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
                    })}
                    className={
                      "form-field" + (errors.totalArea ? " has-error" : "")
                    }
                  />
                  {errors.totalArea && (
                    <Form.Text variant="danger" className="error-label">
                      {errors.totalArea.message}
                    </Form.Text>
                  )}
                </FormGroup>
              </Col>
              <Col xs={6}>
                <FormGroup>
                  <Form.Label htmlFor="year">{t("year")}</Form.Label>
                  <Form.Control
                    type="number"
                    id="year"
                    placeholder={t("write-the-here-please", {
                      namePlaceholder: t("the-year").toLowerCase(),
                    })}
                    {...register("year", {
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
                    })}
                    className={"form-field" + (errors.year ? " has-error" : "")}
                  />
                  {errors.year && (
                    <Form.Text variant="danger" className="error-label">
                      {errors.year.message}
                    </Form.Text>
                  )}
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <Form.Label htmlFor="videoPath">{t("video-path")}</Form.Label>
              <Form.Control
                type="text"
                name="videoPath"
                id="videoPath"
                placeholder={t("write-the-here-please", {
                  namePlaceholder: t("the-video-path").toLowerCase(),
                })}
                {...register("videoPath", {
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
                })}
                className={
                  "form-field" + (errors.videoPath ? " has-error" : "")
                }
              />
              {errors.videoPath && (
                <Form.Text variant="danger" className="error-label">
                  {errors.videoPath.message}
                </Form.Text>
              )}
            </FormGroup>

            <FormGroup>
              <Form.Label htmlFor="price">{t("price")}</Form.Label>
              <Form.Control
                type="number"
                name="price"
                id="price"
                placeholder={t("write-the-here-please", {
                  namePlaceholder: t("price").toLowerCase()
                })}
                {...register("price", {
                  required: {
                    value: true,
                    message: `${t("is-required", {
                      nameRequired: t("price")
                    })}`,
                  },
                })}
                className={
                  "form-field" + (errors.price ? " has-error" : "")
                }
              />
              {errors.price && (
                <Form.Text className="error-label">
                  {errors.price.message}
                </Form.Text>
              )}
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Form.Label htmlFor="filePreview">
                {t("select-preview-image-for-project")}
              </Form.Label>
              <Dropzone
                newFiles={previewImage}
                setFile={setPreviewImage}
                accept={"image/*"}
                multiple={false}
                name={"previewImage"}
                height={"90px"}
              />
            </FormGroup>
            <Col>
              <FormGroup>
                <Form.Label>{t("upload-files")}</Form.Label>
                <br></br>
                <Dropzone
                  newFiles={file}
                  setFile={setFile}
                  accept={"application/x-zip-compressed, application/zip"}
                  multiple={false}
                  name={"file"}
                  height={"90px"}
                />
              </FormGroup>
            </Col>
          </Col>
        </Row>

        <FormGroup>
          <Form.Label htmlFor="uploadFiles">{t("upload-images")}</Form.Label>
          <InputImages
            images={images}
            accept={"image/*"}
            multiple={true}
            imagesEdited={setImages}
            withTags={true}
            onAdd={showTagModal}
          />
        </FormGroup>

        <Button type="submit" variant="primary mt-1">
          {t("send")}
        </Button>
      </Form>

      <ModalForm
        size={"md"}
        className={"Button"}
        modalTitle={t("add-tags")}
        formBody={<FormTag image={currentImageTag} toggle={toggleTagModal} />}
        modalOpen={{ open: modalTagOpen, function: setModalTagOpen }}
      />
    </Container>
  );
};

export default FormProject;
