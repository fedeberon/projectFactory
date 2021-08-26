import React, { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { useForm, Controller } from "react-hook-form";
import ModalForm from "../ModalForm";
import InputImages from "../InputImages/InputImages";
import FormTag from "../FormTag/FormTag";
import Error from "../Error";
import Dropzone from "../Dropzone/Dropzone";
import { Col, Row, Button, Form, FormGroup } from "react-bootstrap";
import CategoryList from "../List/CategoryList/CategoryList";
import PrimaryButton from "../Buttons/PrimaryButton/PrimaryButton";
import CategorySelector from "../CategorySelector/CategorySelector";
import { useDispatch, useSelector } from "react-redux";
import { categoriesActions } from "../../store";

const FormProduct = ({
  toggle,
  onAddProduct,
  onSetProduct,
  productData,
  previewImage,
  setPreviewImage,
  images,
  setImages,
  changeState,
  productId,
}) => {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [timeErrorLive, setTimeErrorLive] = useState(0);
  const selectedCategories = useSelector(state => state.categories.selectedCategories);
  const [modalTagOpen, setModalTagOpen] = useState(false);
  const [currentImageTag, setCurrentImageTag] = useState({});

  const handleToggleTagModal = () =>
    setModalTagOpen((modalTagOpen) => !modalTagOpen);

  const showErrorToLimitTime = (error) => {
    setError(error);
    clearTimeout(timeErrorLive);
    setTimeErrorLive(
      setTimeout(() => {
        setError("");
      }, 3000)
    );
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm(productData);

  const hasPreviewImage = () => previewImage.length > 0;

  const hasCategories = () => selectedCategories.length > 0;

  const hasAnyError = () => {
    if (!imagesHasTags()) {
      showErrorToLimitTime(
        t("is-required", {
          nameRequired: t("form-tag.tag"),
        })
      );
      return true;
    }

    if (!hasPreviewImage()) {
      showErrorToLimitTime(
        t("is-required", {
          nameRequired: t("preview-image"),
        })
      );
      return true;
    }

    if (!hasCategories()) {
      showErrorToLimitTime(
        t("company-creator.cannot-be-empty", {
          fieldName: t("company-creator.the-categories"),
        })
      );
      return true;
    }

    return false;
  };

  const onSubmit = async (
    { name, description, price, width, height, depth },
    event
  ) => {
    const error = hasAnyError();

    if (!error) {
      const data = {
        previewImage: previewImage[0],
        categories: selectedCategories,
        images,
        name,
        description,
        price,
        width,
        height,
        depth,
      };

      if (changeState.stateFormProduct.post) {
        const product = await onAddProduct(data);
        if (product) {
          setPreviewImage([]);
          event.target.reset();
          setError("");
          toggle();
        }
      }

      if (changeState.stateFormProduct.put) {
        const productModify = await onSetProduct(data, productId);
        if (productModify) {
          setPreviewImage([]);
          event.target.reset();
          setError("");
          toggle();
        }
      }

      dispatch(categoriesActions.setSelectedCategories([]));
    }
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

  useEffect(() => {
    if (productData) {
      const categories = productData.defaultValues.categories;
      dispatch(categoriesActions.setSelectedCategories(categories));
    }
  }, [productData]);

  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="row-cols-1 g-4">
          <Col>
            <Row>
              <Col className="col-12">
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
                      className="invalid error-label text-danger"
                    >
                      {errors.name.message}
                    </Form.Text>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row className="row-cols-1 row-cols-md-2">
              <Col className="d-flex flex-column gap-2">
                <FormGroup>
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
                          nameInput: t("the-description"),
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
                      className="invalid error-label text-danger"
                    >
                      {errors.description.message}
                    </Form.Text>
                  )}
                </FormGroup>

                <Row className="row-cols-1 row-cols-md-3">
                  <Form.Group as={Col}>
                    <Form.Label htmlFor="width">{t("width")}</Form.Label>
                    <Controller
                      name="width"
                      control={control}
                      rules={{
                        required: {
                          value: true,
                          message: `${t("is-required", {
                            nameRequired: t("the-width"),
                          })}`,
                        },
                        validate: {
                          positive: (v) =>
                            parseInt(v) > 0 || t("should-be-greater-than-0"),
                        },
                      }}
                      defaultValue=""
                      render={({ field }) => (
                        <Form.Control
                          {...field}
                          type="number"
                          id="width"
                          placeholder={`${t("write-the-here-please", {
                            namePlaceholder: t("the-width").toLowerCase(),
                          })}`}
                          className={
                            "form-field" + (errors.width ? " has-error" : "")
                          }
                          style={{ resize: "none" }}
                        />
                      )}
                    />
                    {errors.width && (
                      <Form.Text
                        variant="danger"
                        className="invalid error-label text-danger"
                      >
                        {errors.width.message}
                      </Form.Text>
                    )}
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label htmlFor="height">{t("height")}</Form.Label>
                    <Controller
                      name="height"
                      control={control}
                      rules={{
                        required: {
                          value: true,
                          message: `${t("is-required", {
                            nameRequired: t("the-height"),
                          })}`,
                        },
                        validate: {
                          positive: (v) =>
                            parseInt(v) > 0 || t("should-be-greater-than-0"),
                        },
                      }}
                      defaultValue=""
                      render={({ field }) => (
                        <Form.Control
                          {...field}
                          type="number"
                          id="height"
                          placeholder={`${t("write-the-here-please", {
                            namePlaceholder: t("the-height").toLowerCase(),
                          })}`}
                          className={
                            "form-field" + (errors.height ? " has-error" : "")
                          }
                          style={{ resize: "none" }}
                        />
                      )}
                    />
                    {errors.height && (
                      <Form.Text
                        variant="danger"
                        className="invalid error-label text-danger"
                      >
                        {errors.height.message}
                      </Form.Text>
                    )}
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label htmlFor="depth">{t("depth")}</Form.Label>
                    <Controller
                      name="depth"
                      control={control}
                      rules={{
                        required: {
                          value: true,
                          message: `${t("is-required", {
                            nameRequired: t("the-depth"),
                          })}`,
                        },
                        validate: {
                          positive: (v) =>
                            parseInt(v) > 0 || t("should-be-greater-than-0"),
                        },
                      }}
                      defaultValue=""
                      render={({ field }) => (
                        <Form.Control
                          {...field}
                          type="number"
                          id="depth"
                          placeholder={`${t("write-the-here-please", {
                            namePlaceholder: t("the-depth").toLowerCase(),
                          })}`}
                          className={
                            "form-field" + (errors.depth ? " has-error" : "")
                          }
                          style={{ resize: "none" }}
                        />
                      )}
                    />
                    {errors.depth && (
                      <Form.Text
                        variant="danger"
                        className="invalid error-label text-danger"
                      >
                        {errors.depth.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Row>

                <FormGroup>
                  <Form.Label htmlFor="price">{t("price")}</Form.Label>
                  <Controller
                    name="price"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: `${t("is-required", {
                          nameRequired: t("the-price"),
                        })}`,
                      },
                      validate: {
                        positive: (v) =>
                          parseInt(v) > 0 || t("should-be-greater-than-0"),
                      },
                    }}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="number"
                        id="price"
                        placeholder={`${t("write-the-here-please", {
                          namePlaceholder: t("the-price").toLowerCase(),
                        })}`}
                        className={
                          "form-field" + (errors.price ? " has-error" : "")
                        }
                        style={{ resize: "none" }}
                      />
                    )}
                  />
                  {errors.price && (
                    <Form.Text
                      variant="danger"
                      className="invalid error-label text-danger"
                    >
                      {errors.price.message}
                    </Form.Text>
                  )}
                </FormGroup>
              </Col>
              <Col className="order-2 order-md-1">
                <FormGroup>
                  <Form.Label htmlFor="filePreview">
                    {t("select-preview-image-for-the-product")}
                  </Form.Label>
                  <Dropzone
                    newFiles={previewImage}
                    setFile={setPreviewImage}
                    accept={"image/*"}
                    multiple={false}
                    name={"previewImage"}
                    height={"235px"}
                  />
                </FormGroup>
              </Col>
              <Col className="col-12 order-1 order-md-2">
                <Form.Group>
                  <Form.Label>
                    {t("company-creator.select-categories-please")}
                  </Form.Label>
                  <Row className="row-cols-1 row-cols-md-2 gap-2 gap-md-0">
                    <Col className="col-12 col-md-6">
                      <Row className="row-cols-1 row-cols-lg-2 gap-1 gap-lg-0">
                        <Col className="col-12">
                          <CategorySelector typeCategory="PRODUCT"/>
                        </Col>
                      </Row>
                    </Col>
                    <Col className="col-auto col-md-6">
                      <CategoryList/>
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col className="p-0">
                <FormGroup className="text-center">
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
                </FormGroup>
              </Col>
            </Row>
            {changeState.stateFormProduct.post && (
              <PrimaryButton dark type="submit" variant="primary mt-1">
                {t("common:send")}
              </PrimaryButton>
            )}
            {changeState.stateFormProduct.put && (
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
        modalTitle={t("add-tags")}
        formBody={
          <FormTag image={currentImageTag} toggle={handleToggleTagModal} />
        }
        modalOpen={{ open: modalTagOpen, function: setModalTagOpen }}
      />
    </div>
  );
};

export default FormProduct;
