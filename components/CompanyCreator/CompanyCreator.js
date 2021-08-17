import React, { useState } from "react";
import { useSession } from "next-auth/client";
import { Button, Row, Col, Form } from "react-bootstrap";
import ModalForm from "../ModalForm";
import useTranslation from "next-translate/useTranslation";
import * as companyService from "../../services/companyService";
import TagList from "../TagList/TagList";
import Error from "../../components/Error";
import Dropzone from "../Dropzone/Dropzone";
import { useForm } from "react-hook-form";
import { Building } from "react-bootstrap-icons";
import PrimaryButton from "../Buttons/PrimaryButton/PrimaryButton";
import CategorySelector from "../CategorySelector/CategorySelector";
import { useDispatch, useSelector } from "react-redux";
import { categoriesActions } from "../../store";

const CompanyCreator = () => {
  const dispatch = useDispatch();
  const [modalCompany, setModalCompany] = useState(false);
  const [session] = useSession();
  const { t } = useTranslation("common");
  const [previewImage, setPreviewImage] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState([]);
  const selectedCategories = useSelector(state => state.categories.selectedCategories);
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

  const toggle = () => setModalCompany(!modalCompany);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async (
    {
      name,
      email,
      telephone,
      contact,
      contactLoad,
      website,
      province,
      location,
      description,
    }
  ) => {
    name = name.trim();
    // You should handle login logic with name, preview and background images and form data
    let data = {
      name,
      email,
      phoneNumber: telephone,
      contact,
      description,
      contactLoad,
      website,
      province,
      location,
    };

    if (name !== "") {
      if (previewImage.length != 0 && backgroundImage.length != 0) {
        if (selectedCategories.length > 0) {
          await companyService.create(
            data,
            previewImage[0],
            backgroundImage[0],
            selectedCategories,
            session?.accessToken,
            session.user.id
          );
          toggle();
          dispatch(categoriesActions.setSelectedCategories([]));
        } else {
          showErrorToLimitTime(
            t("company-creator.cannot-be-empty", {
              fieldName: t("company-creator.the-categories"),
            })
          );
        }
      } else {
        showErrorToLimitTime(
          t("company-creator.cannot-be-empty", {
            fieldName: t("the-image"),
          })
        );
      }
    } else {
      showErrorToLimitTime(
        t("company-creator.cannot-be-empty", {
          fieldName: t("company"),
        })
      );
    }
  };

  return (
    <>
      <Button variant="dark" onClick={toggle}>
        <Building size={25} />
        {t("profile:become-in-a-company")}
      </Button>

      <ModalForm
        size={"xl"}
        fullscreen={"lg-down"}
        className={"Button"}
        modalTitle={t("company-creator.add-company")}
        formBody={
          <>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row className="row-cols-1 g-4">
                <Col>
                  <Row>
                    <Col className="col-12">
                      <h2>{t("company-creator.form-company-creator")}</h2>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="g-3">
                <Col className="col-12 col-md-6">
                  <Form.Group>
                    <Form.Label htmlFor="company">
                      {t("company-creator.company-name")}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      id="name"
                      placeholder={`${t("write-the-here-please", {
                        namePlaceholder: t("the-name").toLowerCase(),
                      })}`}
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
                      className={
                        "form-field" + (errors.name ? " has-error" : "")
                      }
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
                    <Form.Control
                      type="textarea"
                      id="description"
                      rows="10"
                      cols="50"
                      placeholder={`${t("write-the-here-please", {
                        namePlaceholder: t("the-description").toLowerCase(),
                      })}`}
                      className={
                        "form-field" + (errors.description ? " has-error" : "")
                      }
                      style={{ resize: "none" }}
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
                        maxLength: {
                          value: 255,
                          message: `${t("cannot-be-more-than-character", {
                            nameInput: t("description").toLowerCase(),
                            numberCharacters: 255,
                          })}`,
                        },
                      })}
                    />
                    {errors.description && (
                      <Form.Text
                        variant="danger"
                        className="invalid error-label text-danger"
                      >
                        {errors.description.message}
                      </Form.Text>
                    )}
                  </Form.Group>

                  <Form.Group>
                    <Form.Label htmlFor="website">
                      {t("common:formulary.web-page")}
                    </Form.Label>
                    <Form.Control
                      type="website"
                      name="website"
                      id="website"
                      placeholder={t("write-the-here-please", {
                        namePlaceholder: t(
                          "common:formulary.the-web-page"
                        ).toLowerCase(),
                      })}
                      {...register("website", {
                        required: {
                          value: true,
                          message: `${t("is-required", {
                            nameRequired: t("common:formulary.the-web-page"),
                          })}`,
                        },
                        minLength: {
                          value: 3,
                          message: `${t("cannot-be-less-than-character", {
                            nameInput: t("common:formulary.the-web-page"),
                            numberCharacters: 3,
                          })}`,
                        },
                      })}
                      className={
                        "form-field" + (errors.website ? " has-error" : "")
                      }
                    />
                    {errors.website && (
                      <Form.Text
                        variant="danger"
                        className="invalid error-Form.Label text-danger"
                      >
                        {errors.website.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="contact">{t("contact")}</Form.Label>
                    <Form.Control
                      type="text"
                      name="contact"
                      id="contact"
                      placeholder={`${t("write-the-here-please", {
                        namePlaceholder: t(
                          "common:formulary.the-contact"
                        ).toLowerCase(),
                      })}`}
                      {...register("contact", {
                        required: {
                          value: true,
                          message: `${t("is-required", {
                            nameRequired: t("common:formulary.the-contact"),
                          })}`,
                        },
                        minLength: {
                          value: 3,
                          message: `${t("cannot-be-less-than-character", {
                            nameInput: t("common:formulary.the-contact"),
                            numberCharacters: 3,
                          })}`,
                        },
                      })}
                      className={
                        "form-field" + (errors.contact ? " has-error" : "")
                      }
                    />
                    {errors.contact && (
                      <Form.Text
                        variant="danger"
                        className="invalid error-Form.Label text-danger"
                      >
                        {errors.contact.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="contactLoad">
                      {t("common:formulary.contact-charge")}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="contactLoad"
                      id="contactLoad"
                      placeholder={t("write-the-here-please", {
                        namePlaceholder: t(
                          "common:formulary.the-contact-charge"
                        ).toLowerCase(),
                      })}
                      {...register("contactLoad", {
                        required: {
                          value: true,
                          message: `${t("is-required", {
                            nameRequired: t(
                              "common:formulary.the-contact-charge"
                            ),
                          })}`,
                        },
                        minLength: {
                          value: 3,
                          message: `${t("cannot-be-less-than-character", {
                            nameInput: t("common:formulary.the-contact-charge"),
                            numberCharacters: 3,
                          })}`,
                        },
                      })}
                      className={
                        "form-field" + (errors.contactLoad ? " has-error" : "")
                      }
                    />
                    {errors.contactLoad && (
                      <Form.Text
                        variant="danger"
                        className="invalid error-Form.Label text-danger"
                      >
                        {errors.contactLoad.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="email">
                      {t("common:formulary.contact-email")}
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      id="email"
                      placeholder={t("write-the-here-please", {
                        namePlaceholder: t(
                          "common:formulary.the-contact-email"
                        ).toLowerCase(),
                      })}
                      {...register("email", {
                        required: {
                          value: true,
                          message: `${t("is-required", {
                            nameRequired: t(
                              "common:formulary.the-contact-email"
                            ),
                          })}`,
                        },
                        minLength: {
                          value: 3,
                          message: `${t("cannot-be-less-than-character", {
                            nameInput: t("common:formulary.the-contact-email"),
                            numberCharacters: 3,
                          })}`,
                        },
                      })}
                      className={
                        "form-field" + (errors.email ? " has-error" : "")
                      }
                    />
                    {errors.email && (
                      <Form.Text
                        variant="danger"
                        className="invalid error-Form.Label text-danger"
                      >
                        {errors.email.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="telephone">
                      {t("common:formulary.telephone")}
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      name="telephone"
                      id="telephone"
                      placeholder={t("common:write-the-here-please", {
                        namePlaceholder: t(
                          "common:formulary.the-telephone"
                        ).toLowerCase(),
                      })}
                      {...register("telephone", {
                        required: {
                          value: true,
                          message: `${t("common:is-required", {
                            nameRequired: t("common:formulary.the-telephone"),
                          })}`,
                        },
                        minLength: {
                          value: 10,
                          message: `${t(
                            "common:cannot-be-less-than-character",
                            {
                              nameInput: t("common:formulary.the-telephone"),
                              numberCharacters: 10,
                            }
                          )}`,
                        },
                      })}
                      className={
                        "form-field" + (errors.telephone ? " has-error" : "")
                      }
                    />
                    {errors.telephone && (
                      <Form.Text
                        variant="danger"
                        className="invalid error-Form.Label text-danger"
                      >
                        {errors.telephone.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col className="col-12 col-md-6">
                  <Form.Group>
                    <Form.Label htmlFor="logo">
                      {t("company-creator.select-logo")}
                    </Form.Label>

                    <Dropzone
                      newFiles={previewImage}
                      setFile={setPreviewImage}
                      accept={"image/*"}
                      multiple={false}
                      name={"filePreview"}
                      height={"145px"}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label htmlFor="backgroundImage" className="mt-4">
                      {t("company-creator.select-background-image")}
                    </Form.Label>

                    <Dropzone
                      newFiles={backgroundImage}
                      setFile={setBackgroundImage}
                      accept={"image/*"}
                      multiple={false}
                      name={"filePreview"}
                      height={"145px"}
                    />
                  </Form.Group>
                </Col>

                <Col className="col-12 order-1 order-md-2">
                  <Form.Group>
                    <Form.Label>
                      {t("company-creator.select-categories-please")}
                    </Form.Label>

                    <Row className="row-cols-1 row-cols-md-2 gap-2 gap-md-0">
                      <Col className="col-12 col-md-6">
                        <CategorySelector typeCategory="COMPANY"/>
                      </Col>
                      <Col className="col-auto col-md-6">
                        <TagList/>
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="col-12">
                  <h2>{t("common:formulary.location-of-the-company")}</h2>
                </Col>
              </Row>
              <Row className="row-cols-1 row-cols-md-2 g-3">
                <Col>
                  <Form.Group>
                    <Form.Label htmlFor="province">
                      {t("common:province")}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="province"
                      id="province"
                      placeholder={t("write-the-here-please", {
                        namePlaceholder: t(
                          "common:formulary.the-province"
                        ).toLowerCase(),
                      })}
                      {...register("province", {
                        required: {
                          value: true,
                          message: `${t("is-required", {
                            nameRequired: t("common:formulary.the-province"),
                          })}`,
                        },
                        minLength: {
                          value: 3,
                          message: `${t("cannot-be-less-than-character", {
                            nameInput: t("common:formulary.the-province"),
                            numberCharacters: 3,
                          })}`,
                        },
                      })}
                      className={
                        "form-field" + (errors.province ? " has-error" : "")
                      }
                    />
                    {errors.province && (
                      <Form.Text
                        variant="danger"
                        className="invalid error-Form.Label text-danger"
                      >
                        {errors.province.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label htmlFor="location">
                      {t("common:location")}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="location"
                      id="location"
                      placeholder={t("write-the-here-please", {
                        namePlaceholder: t(
                          "common:formulary.the-location"
                        ).toLowerCase(),
                      })}
                      {...register("location", {
                        required: {
                          value: true,
                          message: `${t("is-required", {
                            nameRequired: t("common:formulary.the-location"),
                          })}`,
                        },
                        minLength: {
                          value: 3,
                          message: `${t("cannot-be-less-than-character", {
                            nameInput: t("common:formulary.the-location"),
                            numberCharacters: 3,
                          })}`,
                        },
                      })}
                      className={
                        "form-field" + (errors.location ? " has-error" : "")
                      }
                    />
                    {errors.location && (
                      <Form.Text
                        variant="danger"
                        className="invalid error-Form.Label text-danger"
                      >
                        {errors.location.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="mt-2">
                  <PrimaryButton dark type="submit" variant="primary mt-1">
                    {t("company-creator.add-company")}
                  </PrimaryButton>
                </Col>
              </Row>
              {error && (
                <Row className="mt-2">
                  <Col>
                    <Error error={error} />
                  </Col>
                </Row>
              )}
            </Form>
          </>
        }
        modalOpen={{ open: modalCompany, function: setModalCompany }}
      />
    </>
  );
};

export default CompanyCreator;
