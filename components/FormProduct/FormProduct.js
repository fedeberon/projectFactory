import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";
import { useForm, Controller } from "react-hook-form";
import ModalForm from "../ModalForm";
import InputImages from "../InputImages/InputImages";
import Error from "../Error";
import Dropzone from "../Dropzone/Dropzone";
import {
    Col,
    Row,
    Button,
    Form,
    FormGroup,
  } from "react-bootstrap";

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
    productId
}) => {
    const { t } = useTranslation("common");
    const [error, setError] = useState("");
    const [timeErrorLive, setTimeErrorLive] = useState(0);

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
            price
        };
        if (previewImage.length > 0) {
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
        } else {
            showErrorToLimitTime(
                t("is-required", {
                    nameRequired: t("preview-image"),
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
                                        onAdd={()=>{}}
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
        </div>
    );
};

export default FormProduct;