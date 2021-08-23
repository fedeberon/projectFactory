import React, { useState } from "react";
import { Col, Row, Button, Form } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import useTranslation from "next-translate/useTranslation";
import ModalForm from "../ModalForm";
import FormTag from "../FormTag/FormTag";

//Components
import InputImages from "../../components/InputImages/InputImages";
import Error from "../../components/Error";
import Dropzone from "../Dropzone/Dropzone";
import PrimaryButton from "../Buttons/PrimaryButton/PrimaryButton";
import CategorySelector from "../CategorySelector/CategorySelector";
import TagList from "../TagList/TagList";
import { useDispatch, useSelector } from "react-redux";
import { categoriesActions } from "../../store";

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
  buildingWorkId,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation("common");
  const [currentImageTag, setCurrentImageTag] = useState({});
  const [modalTagOpen, setModalTagOpen] = useState(false);
  const [error, setError] = useState("");
  const [timeErrorLive, setTimeErrorLive] = useState(0);
  const selectedCategories = useSelector(state => state.categories.selectedCategories);

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
    formState: { errors },
    handleSubmit,
  } = useForm(buildingWorkData);

  const hasPreviewImage = () => previewImage.length > 0;

  const hasAnyCategory = () => selectedCategories.length > 0;

  const hasAnyError = () => {
    if (!imagesHasTags()) {
      showErrorToLimitTime(
        t("is-required", {
          nameRequired: t("form-tag.tag"),
        })
      );
      return true;
    }

    if (!error && !hasPreviewImage()) {
      showErrorToLimitTime(
        t("is-required", {
          nameRequired: t("preview-image"),
        })
      );
      return true;
    }

    if (!error && !hasAnyCategory()) {
      showErrorToLimitTime(
        t("is-required", {
          nameRequired: t("categories"),
        })
      );
      return true;
    }

    return false;
  };

  const onSubmit = async ({ name, description }, event) => {
    const error = hasAnyError();

    if (!error) {
      let data = {
        previewImage: previewImage[0],
        categories: selectedCategories,
        images,
        name,
        description,
      };
  
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
        const buildingWorkModify = await onSetbuildingWork(
          data,
          buildingWorkId
        );
  
        if (buildingWorkModify) {
          setPreviewImage([]);
          event.target.reset();
          setError("");
          toggle();
        }
      }

      dispatch(categoriesActions.setSelectedCategories([]));
    }
  }

  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="row-cols-1 gap-2">
          <Col>
            <Row className="row-cols-1 row-cols-sm-2 gap-2 gap-sm-0">
              <Col>
                <Form.Group>
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
                          nameInput: t("name").toLowerCase(),
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
                    <Form.Text
                      variant="danger"
                      className="invalid error-Form.Label text-danger"
                    >
                      {errors.name.message}
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="description">
                    {t("description")}
                  </Form.Label>
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
                      <Form.Control
                        {...field}
                        as="textarea"
                        id="description"
                        rows={6}
                        cols={50}
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
                    <Form.Text
                      variant="danger"
                      className="invalid error-Form.Label text-danger"
                    >
                      {errors.description.message}
                    </Form.Text>
                  )}
                </Form.Group>
                <div className="mt-4">
                  <CategorySelector typeCategory="BUILDING_WORK"/>
                </div>
                <div className="mt-4">
                  <TagList/>
                </div>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label htmlFor="filePreview">
                    {t("select-preview-image-for-building-work")}
                  </Form.Label>
                  <Dropzone
                    newFiles={previewImage}
                    setFile={setPreviewImage}
                    accept={"image/*"}
                    multiple={false}
                    name={"previewImage"}
                    height={"237px"}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col className="p-0">
                <Form.Group className="text-center">
                  <Form.Label htmlFor="uploadFiles">
                    {t("common:upload-images")}
                  </Form.Label>
                  <InputImages
                    images={images}
                    accept={"image/*"}
                    multiple={true}
                    imagesEdited={setImages}
                    withTags={true}
                    onAdd={showTagModal}
                  />
                </Form.Group>
              </Col>
            </Row>
            {changeState.stateFormObra.post && (
              <PrimaryButton dark type="submit">
                {t("common:send")}
              </PrimaryButton>
            )}
            {changeState.stateFormObra.put && (
              <Button type="submit" variant="warning mt-1">
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
