import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";
import { useForm, Controller } from "react-hook-form";
import ModalForm from "../ModalForm";
import InputImages from "../InputImages/InputImages";
import FormTag from "../FormTag/FormTag";
import Error from "../Error";
import Dropzone from "../Dropzone/Dropzone";
import {
    Col,
    Row,
    Button,
    Form,
    FormGroup,
} from "react-bootstrap";
import TagList from "../TagList/TagList";

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
    const [error, setError] = useState("");
    const [timeErrorLive, setTimeErrorLive] = useState(0);
    const [tagsCategories, setTagsCategories] = useState([]);
    const [modalTagOpen, setModalTagOpen] = useState(false);
    const [currentImageTag, setCurrentImageTag] = useState({});

    const handleToggleTagModal = () => setModalTagOpen((modalTagOpen) => !modalTagOpen);

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
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(productData);

    const onSubmit = async ({ name, description, price }, event) => {
        let data = {
            previewImage: previewImage[0],
            images,
            name,
            description,
            price,
        };
        if (!imagesHasTags()) {
            showErrorToLimitTime(
                t("is-required", {
                    nameRequired: t("form-tag.tag"),
                })
            );
            return;
        }
            
        if (!(previewImage.length > 0)) {
            showErrorToLimitTime(
                t("is-required", {
                    nameRequired: t("preview-image"),
                })
            );
            return;
        }
        
        if (!(tagsCategories.length > 0)) {
            showErrorToLimitTime(
                t("company-creator.cannot-be-empty", {
                    fieldName: t("company-creator.the-categories"),
                })
            );
            return;
        }
        data.categories = tagsCategories.map(tag => {
            return { "name": tag.tag };
        });
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
    };

    const imagesHasTags = () => {
        if (images.length > 0) {
          const imagesWithoutTags = images.filter((img) => img.tags.length == 0);
          return imagesWithoutTags.length == 0;
        } else {
          return true;
        }
    };

    const isEqual = (tag) => {
        for (const elem of tagsCategories) {
          if (elem.tag === tag.tag.toLowerCase()) {
            return true;
          }
        }
        return false;
    };

    const AddCategory = () => {
        const category = document
          .querySelector("#category")
          .value.toLowerCase()
          .trim();
        const parse = { tag: category };
        if (category !== "") {
          if (!isEqual(parse)) {
            const newTagsCategories = Array.from(tagsCategories);
            newTagsCategories.push(parse);
            setTagsCategories(newTagsCategories);
          } else {
            showErrorToLimitTime(
              t("company-creator.already-exists", {
                fieldName: t("company-creator.the-category"),
              })
            );
          }
        } else {
          showErrorToLimitTime(
            t("company-creator.cannot-be-empty", {
              fieldName: t("company-creator.the-category"),
            })
          );
        }
    };

    const removeTagCategory = (tagCategory) => {
        const newTagsCategories = Array.from(tagsCategories);
        const index = newTagsCategories.indexOf(tagCategory);
        if (index > -1) {
          newTagsCategories.splice(index, 1);
          setTagsCategories(newTagsCategories);
        }
    };

    const showTagModal = (img) => {
        setModalTagOpen(true);
        setCurrentImageTag(img);
    };

    return (
        <div>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row className="row-cols-1 g-4">
                    <Col>
                        <Row>
                            <Col className="col-12">
                            </Col>
                        </Row>
                        <Row>
                            <Col>
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
                                            className="invalid error-label text-danger"
                                        >
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
                                        <Form.Text
                                            variant="danger"
                                            className="invalid error-label text-danger"
                                        >
                                            {errors.description.message}
                                        </Form.Text>
                                    )}
                                </FormGroup>
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
                                        defaultValue=""
                                        render={({ field }) => (
                                            <Form.Control
                                                {...field}
                                                type="number"
                                                id="price"
                                                rows="10"
                                                cols="50"
                                                placeholder={`${t("write-the-here-please", {
                                                    namePlaceholder: t("the-price").toLowerCase(),
                                                })}`}
                                                className={
                                                    "form-field" +
                                                    (errors.price ? " has-error" : "")
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

                                <Form.Group>
                                    <Form.Label>
                                    {t("company-creator.select-categories-please")}
                                    </Form.Label>
                                    <Col className="col-12 d-flex">
                                    <Form.Control type="text" id="category" />
                                    <Button className="mx-4" onClick={AddCategory}>
                                        {t("company-creator.add-category")}
                                    </Button>
                                    </Col>
                                    <Col className="col-auto">
                                    <div className="my-3">
                                        <TagList
                                        tags={tagsCategories}
                                        onDeleteTag={removeTagCategory}
                                        />
                                    </div>
                                    </Col>
                                </Form.Group>
                            </Col>
                            <Col>
                                <FormGroup>
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
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="p-0">
                                <FormGroup className="text-center">
                                    <Form.Label htmlFor="uploadFiles">{t("common:upload-images")}</Form.Label>
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
                            <Button type="submit" variant="primary mt-1">
                                {t("common:send")}
                            </Button>
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
                formBody={<FormTag image={currentImageTag} toggle={handleToggleTagModal} />}
                modalOpen={{ open: modalTagOpen, function: setModalTagOpen }}
            />
        </div>
    );
};

export default FormProduct;
