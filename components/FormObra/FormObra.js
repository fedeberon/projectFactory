import React, { useState } from "react";
import {
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import useTranslation from "next-translate/useTranslation";
import ModalForm from "../ModalForm";
import FormTag from "../FormTag/FormTag";

//Components
import InputImages from "../../components/InputImages/InputImages";
import Error from "../../components/Error";
import Dropzone from "../Dropzone/Dropzone";

const FormObra = ({
  toggle,
  onAddbuildingWork,
  onSetbuildingWork,
  buildingWorkData,
  previewImage,
  setPreviewImage,
  images,
  setImages,
  changeState,
  buildingWorkId
}) => {
  const { t } = useTranslation("common");
  const [currentImageTag, setCurrentImageTag] = useState({});
  const [modalTagOpen, setModalTagOpen] = useState(false);
  const [error, setError] = useState("");
  const [timeErrorLive, setTimeErrorLive] = useState(0);

  const toggleTagModal = () => setModalTagOpen(!modalTagOpen);

  const showErrorToLimitTime = (error) => {
    setError(error);
    clearTimeout(timeErrorLive);
    setTimeErrorLive(
      setTimeout(() => {
        setError("");
      }, 3000)
    );
  };

  const imagesHasTags = () => {
    if (images.length > 0) {
      const imagesWithoutTags = images.filter((img) => img.tags.length == 0);
      return imagesWithoutTags.length == 0;
    } else {
      return true;
    }
  };

  const showTagModal = (img) => {
    setModalTagOpen(true);
    setCurrentImageTag(img);
  };

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm(buildingWorkData);

  const onSubmit = async ({ name, description }, event) => {
    if (imagesHasTags()) {
      let data = {
        previewImage: previewImage[0],
        images,
        name,
        description,
      };
      if (previewImage.length > 0) {
        //aca
        if (changeState.stateFormObra.post) {
          const buildingWork = await onAddbuildingWork(data);
          if (buildingWork) {
            setPreviewImage([]);
            event.target.reset();
            setError("");
            toggle();
          }
        }
        if (changeState.stateFormObra.put) {
          const buildingWorkModify = await onSetbuildingWork(data, buildingWorkId);
          if (buildingWorkModify) {
            setPreviewImage([]);
            event.target.reset();
            setError("");
            toggle();
          }
        }
      } else {
        showErrorToLimitTime(
          t("is-required", {
            nameRequired: t("preview-image"),
          })
        );
      }
    } else {
      showErrorToLimitTime(
        t("is-required", {
          nameRequired: t("form-tag.tag"),
        })
      );
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="row-cols-1 g-4">
          <Col>
            <Row>
              <Col className="col-12">
                {/* <h2>{t("formulary.professional-profile")}</h2> */}
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="name">{t("name")}</Label>
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
                          nameInput: t("name").toLowerCase(),
                          numberCharacters: 3,
                        })}`,
                      },
                    }}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        id="name"
                        placeholder={`${t("write-the-here-please", {
                          namePlaceholder: t("the-name").toLowerCase(),
                        })}`}
                        className={
                          "form-field" + (errors.name ? " has-error" : "")
                        }
                      />
                    )}
                  />
                  {errors.name && (
                    <FormText
                      color="danger"
                      className="invalid error-label text-danger"
                    >
                      {errors.name.message}
                    </FormText>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label for="description">{t("description")}</Label>
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
                          nameInput: t("description").toLowerCase(),
                          numberCharacters: 3,
                        })}`,
                      },
                      maxLength: {
                        value: 255,
                        message: `${t("cannot-be-more-than-character", {
                          nameInput: t("description").toLowerCase(),
                          numberCharacters: 255,
                        })}`,
                      },
                    }}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="textarea"
                        id="description"
                        rows="10"
                        cols="50"
                        placeholder={`${t("write-the-here-please", {
                          namePlaceholder: t("the-description").toLowerCase(),
                        })}`}
                        className={
                          "form-field" +
                          (errors.description ? " has-error" : "")
                        }
                        style={{ resize: "none" }}
                      />
                    )}
                  />
                  {errors.description && (
                    <FormText
                      color="danger"
                      className="invalid error-label text-danger"
                    >
                      {errors.description.message}
                    </FormText>
                  )}
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label for="filePreview">
                    {t("select-preview-image-for-building-work")}
                  </Label>
                  <Dropzone
                    newFiles={previewImage}
                    setFile={setPreviewImage}
                    accept={"image/*"}
                    multiple={false}
                    name={"previewImage"}
                    height={"237px"}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col className="p-0">
                <FormGroup className="text-center">
                  <Label for="uploadFiles">{t("common:upload-images")}</Label>
                  <InputImages
                    images={images}
                    accept={"image/*"}
                    multiple={true}
                    imagesEdited={setImages}
                    withTags={true}
                    onAdd={showTagModal}
                  />
                </FormGroup>
              </Col>
            </Row>
            {changeState.stateFormObra.post && (
              <Button type="submit" color="primary mt-1">
                {t("common:send")}
              </Button>
            )}
            {changeState.stateFormObra.put && (
              <Button type="submit" color="warning mt-1">
                {t("common:send")}
              </Button>
            )}
          </Col>
        </Row>
      </Form>
      {error && (
        <Row className="mt-2">
          <Col>
            <Error error={error} />
          </Col>
        </Row>
      )}

      <ModalForm
        size={"md"}
        className={"Button"}
        modalTitle={t("common:add-tags")}
        formBody={<FormTag image={currentImageTag} toggle={toggleTagModal} />}
        modalOpen={{ open: modalTagOpen, function: setModalTagOpen }}
      />
    </div>
  );
};

export default FormObra;
