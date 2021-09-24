import React, { useState, useEffect } from "react";
import { Col, Row, Button, Form } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import useTranslation from "next-translate/useTranslation";
import ModalForm from "../ModalForm";
import FormTag from "../FormTag/FormTag";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";

//Components
import InputImages from "../../components/InputImages/InputImages";
import Error from "../../components/Error";
import Dropzone from "../Dropzone/Dropzone";
import PrimaryButton from "../Buttons/PrimaryButton/PrimaryButton";
import CategorySelector from "../CategorySelector/CategorySelector";
import CategoryList from "../List/CategoryList/CategoryList";
import { categoriesActions } from "../../store";
import image from "next/image";

// Styles
import styles from "./FormObra.module.css";

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
  const selectedCategories = useSelector(
    (state) => state.categories.buildingWorks
  );
  const selectedCategoriesDefault = useSelector(
    (state) => state.categories.selectedCategories
  );

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

  const imagesHasTags = (statePut) => {
    if (images.length > 0) {
      // if (statePut) {
      //   images.map((img) => {
      //     if (img.tags.length == 0) {
      //       img.tags.push("delete");
      //     }
      //   });
      // }
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

  const hasAnyImages = () => {
    if (images.length > 0) {
      return images.some((img) => (!img.remove && img.added) || !img.added);
    }
  };

  const hasAnyError = (statePut) => {
    if (!imagesHasTags(statePut)) {
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

    if (!hasAnyImages()) {
      showErrorToLimitTime(
        t("is-required", {
          nameRequired: t("carousel-image-creator.images"),
        })
      );
      return true;
    }

    return false;
  };

  const onSubmit = async ({ name, description, categories }, event) => {
    const error = hasAnyError(changeState.stateFormObra.put);
    if (!error) {
      let data = {
        previewImage: previewImage[0],
        // categories: selectedCategories,
        categories: [categories],
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
  };

  // useEffect(() => {
  //   console.log("buildingWorkData", buildingWorkData);
  // }, [buildingWorkData]);

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
                {/* <div className="mt-4">
                  <CategorySelector typeCategory="BUILDING_WORK" />
                </div>
                <div className="mt-4">
                  <CategoryList />
                </div> */}
                <Form.Group className={`mb-2`}>
                  <Form.Label htmlFor="categories">
                    {t("company-creator.select-category-please")}
                  </Form.Label>
                  <Controller
                    name="categories"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: `${t("common:is-required", {
                          nameRequired: t(
                            "common:formulary.the-buildingWork-category"
                          ),
                        })}`,
                      },
                    }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        inputId={"categories"}
                        defaultValue={selectedCategoriesDefault}
                        options={selectedCategories}
                        getOptionLabel={(option) => `${option?.name}`}
                        getOptionValue={(option) => `${option?.id}`}
                        isClearable
                        className={
                          "form-field" + (errors.categories ? " has-error" : "")
                        }
                      />
                    )}
                  />
                  {errors.categories && (
                    <Form.Text
                      variant="danger"
                      className="invalid error-Form.Label text-danger"
                    >
                      {errors.categories.message}
                    </Form.Text>
                  )}
                </Form.Group>
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
        size={"lg"}
        fullscreen={"lg-down"}
        className={`Button ${styles.bgModal}`}
        modalTitle={t("common:add-tags")}
        formBody={<FormTag image={currentImageTag} toggle={toggleTagModal} />}
        modalOpen={{ open: modalTagOpen, function: setModalTagOpen }}
      />
    </div>
  );
};

export default FormObra;
