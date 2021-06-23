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
import useTranslation from "next-translate/useTranslation";
import Select from "react-select";
import Dropzone from "./Dropzone/Dropzone";
import * as youtubeService from "../services/youtubeService";
import InputImages from "../components/InputImages/InputImages";
import FormTag from "../components/FormTag/FormTag";
import ModalForm from "../components/ModalForm";

const FormProject = ({ onAddProject, professionals, toggle }) => {
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

  useEffect(async () => {
    setOptions(professionals);
  }, [professionals]);

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
      professionalsSelected,
      videoPath,
    },
    event
  ) => {
    if (youtubeService.isValidVideo(videoPath)) {
      // You should handle login logic with name, description, totalArea, website, year, professional selected, preview image, video path for form data
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
      };
      let id = professionalsSelected.id;
      await onAddProject(data, id);
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
              <Label for="name">{t("name")}</Label>
              <Input
                type="text"
                id="name"
                placeholder={t("write-the-here-please", {
                  namePlaceholder: t("the-name").toLowerCase()
                })}
                {...register("name", {
                  required: {
                    value: true,
                    message: `${t("is-required", {
                      nameRequired: t("the-name")
                    })}`,
                  },
                  minLength: {
                    value: 3,
                    message: `${t("cannot-be-less-than-character", {
                      nameInput: t("the-name"),
                      numberCharacters: 3
                    })}`,
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
              <Label for="description">{t("description")}</Label>
              <Input
                type="text"
                id="description"
                placeholder={t("write-the-here-please", {
                  namePlaceholder: t("the-description").toLowerCase(),
                })}
                {...register("description", {
                  required: {
                    value: true,
                    message: `${t("is-required", {
                      nameRequired: t("the-description")
                    })}`,
                  },
                  minLength: {
                    value: 3,
                    message: `${t(
                      "cannot-be-less-than-character", {
                        nameInput: t("the-description"),
                        numberCharacters: 3
                      }
                    )}`,
                  },
                })}
                className={
                  "form-field" + (errors.description ? " has-error" : "")
                }
              />
              {errors.description && (
                <FormText className="error-label">
                  {errors.description.message}
                </FormText>
              )}
            </FormGroup>

            <FormGroup>
              <Label for="email">{t("write-the-web-site")}</Label>
              <Input
                type="email"
                id="email"
                placeholder={t("write-the-here-please", {
                  namePlaceholder: t("the-web-site").toLowerCase()
                })}
                {...register("website", {
                  required: {
                    value: true,
                    message: `${t("is-required", {
                      nameRequired: t("the-web-site")
                    })}`,
                  },
                  minLength: {
                    value: 3,
                    message: `${t("cannot-be-less-than-character" , {
                      nameInput: t("the-web-site"),
                      numberCharacters: 3
                    })}`,
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
                  <Label for="totalArea">{t("total-area")}</Label>
                  <Input
                    type="number"
                    id="totalArea"
                    placeholder={t("write-the-here-please", {
                      namePlaceholder: t("the-total-area").toLowerCase()
                    })}
                    {...register("totalArea", {
                      required: {
                        value: true,
                        message: `${t("is-required", {
                          nameRequired: t("the-total-area")
                        })}`,
                      },
                      minLength: {
                        value: 3,
                        message: `${t(
                          "cannot-be-less-than-character", {
                            nameInput: t("the-total-area"),
                            numberCharacters: 3
                          }
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
                  <Label for="year">{t("year")}</Label>
                  <Input
                    type="number"
                    id="year"
                    placeholder={t("write-the-here-please", {
                      namePlaceholder: t("the-year").toLowerCase()
                    })}
                    {...register("year", {
                      required: {
                        value: true,
                        message: `${t("is-required", {
                          nameRequired: t("the-year")
                        })}`,
                      },
                      minLength: {
                        value: 3,
                        message: `${t("cannot-be-less-than-character", {
                          nameInput: t("the-year"),
                          numberCharacters: 3
                        })}`,
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
              <Label for="videoPath">{t("video-path")}</Label>
              <Input
                type="text"
                name="videoPath"
                id="videoPath"
                placeholder={t("write-the-here-please", {
                  namePlaceholder: t("the-video-path").toLowerCase()
                })}
                {...register("videoPath", {
                  required: {
                    value: true,
                    message: `${t("is-required", {
                      nameRequired: t("the-video-path")
                    })}`,
                  },
                  minLength: {
                    value: 3,
                    message: `${t("cannot-be-less-than-character", {
                      nameInput: t("the-video-path"),
                      numberCharacters: 3
                    })}`,
                  },
                })}
                className={
                  "form-field" + (errors.videoPath ? " has-error" : "")
                }
              />
              {errors.videoPath && (
                <FormText className="error-label">
                  {errors.videoPath.message}
                </FormText>
              )}
            </FormGroup>

            <FormGroup>
              <Label for="professionalsSelected">
                {t("professionals-selected")}
              </Label>
              <Controller
                name="professionalsSelected"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: `${t("is-required", {
                      nameRequired: t("professionals-selected")
                    })}`,
                  },
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    inputId={"professionalsSelected"}
                    options={options}
                    getOptionLabel={(option) => `${option?.contact}`}
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
          </Col>
          <Col>
            <FormGroup>
              <Label for="filePreview">
                {t("select-preview-image-for-project")}
              </Label>
              <Dropzone
                newFiles={previewImage}
                setFile={setPreviewImage}
                accept={"image/*"}
                multiple={false}
                name={"previewImage"}
              />
            </FormGroup>
            <Col>
              <FormGroup>
                <Label>{t("upload-files")}</Label>
                <br></br>
                <Dropzone
                  newFiles={file}
                  setFile={setFile}
                  accept={"application/x-zip-compressed, application/zip"}
                  multiple={false}
                  name={"file"}
                />
              </FormGroup>
            </Col>
          </Col>
        </Row>

        <FormGroup>
          <Label for="uploadFiles">{t("upload-images")}</Label>
          <InputImages
            accept={"image/*"}
            multiple={true}
            imagesEdited={setImages}
            withTags={true}
            onAdd={showTagModal}
          />
        </FormGroup>

        <Button type="submit" color="primary mt-1">
          {t("send")}
        </Button>
      </Form>

      <ModalForm
        className={"Button"}
        modalTitle={t("add-tags")}
        formBody={<FormTag image={currentImageTag} toggle={toggleTagModal} />}
        modalOpen={{ open: modalTagOpen, function: setModalTagOpen }}
      />
    </Container>
  );
};

export default FormProject;
