import React, { useState } from "react";
import { useSession } from "next-auth/client";
import {
  Button,
  Row,
  Col,
  Label,
  Form,
  FormGroup,
  FormText,
  Input,
} from "reactstrap";
import ModalForm from "../ModalForm";
import useTranslation from "next-translate/useTranslation";
import * as companyService from "../../services/companyService";
import companyCreatorStyles from "./CompanyCreator.module.css";
import TagList from "../TagList/TagList";
import Error from "../../components/Error";
import Dropzone from "../Dropzone/Dropzone";
import { useForm } from "react-hook-form";
import { Building } from "react-bootstrap-icons";

const CompanyCreator = () => {
  const [modalCompany, setModalCompany] = useState(false);
  const [session] = useSession();
  const { t } = useTranslation("common");
  const [previewImage, setPreviewImage] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState([]);
  const [tagsCategories, setTagsCategories] = useState([]);
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

  const isEqual = (tag) => {
    for (const elem of tagsCategories) {
      if (elem.tag === tag.tag.toLowerCase()) {
        return true;
      }
    }
    return false;
  };

  const removeTagCategory = (tagCategory) => {
    const newTagsCategories = Array.from(tagsCategories);
    const index = newTagsCategories.indexOf(tagCategory);
    if (index > -1) {
      newTagsCategories.splice(index, 1);
      setTagsCategories(newTagsCategories);
    }
  };

  const toggle = () => setModalCompany(!modalCompany);

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

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async (
    {
      name,
      email,
      contact,
      contactLoad,
      website,
      province,
      location,
    },
    event
  ) => {
    name = name.toLowerCase().trim();
    // You should handle login logic with name, preview and background images and form data
    let data = {
      name,
      email,
      contact,
      contactLoad,
      website,
      province,
      location,
    };

    if (name !== "") {
      if (previewImage.length != 0 && backgroundImage.length != 0) {
        if (tagsCategories.length > 0) {
          await companyService.create(
            data,
            previewImage[0],
            backgroundImage[0],
            tagsCategories,
            session?.accessToken,
            session.user.id
          );
          setTagsCategories([]);
          setPreviewImage([]);
          toggle();
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
      <Button color="dark" onClick={toggle}>
        <Building size={25} />
        {` `}
        {t("profile:become-in-a-company")}
      </Button>

      <ModalForm
        size={"xl"}
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
                <Col className="col-6">
                  <FormGroup>
                    <Label for="company">
                      {t("company-creator.company-name")}
                    </Label>
                    <Input
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
                      <FormText
                        color="danger"
                        className="invalid error-label text-danger"
                      >
                        {errors.name.message}
                      </FormText>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="website">
                      {t("common:formulary.web-page")}
                    </Label>
                    <Input
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
                      <FormText color="danger" className="error-label">
                        {errors.website.message}
                      </FormText>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="contact">{t("contact")}</Label>
                    <Input
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
                      <FormText
                        color="danger"
                        className="invalid error-label text-danger"
                      >
                        {errors.contact.message}
                      </FormText>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="contactLoad">
                      {t("common:formulary.contact-charge")}
                    </Label>
                    <Input
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
                      <FormText color="danger" className="invalid error-label">
                        {errors.contactLoad.message}
                      </FormText>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="email">
                      {t("common:formulary.contact-email")}
                    </Label>
                    <Input
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
                      <FormText color="danger" className="error-label">
                        {errors.email.message}
                      </FormText>
                    )}
                  </FormGroup>
                </Col>
                <Col className="col-6">
                  <FormGroup>
                    <Label htmlFor="logo">
                      {t("company-creator.select-logo")}
                    </Label>

                    <Dropzone
                      newFiles={previewImage}
                      setFile={setPreviewImage}
                      accept={"image/*"}
                      multiple={false}
                      name={"filePreview"}
                      height={"145px"}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="backgroundImage" className="mt-4">
                      {t("company-creator.select-background-image")}
                    </Label>

                    <Dropzone
                      newFiles={backgroundImage}
                      setFile={setBackgroundImage}
                      accept={"image/*"}
                      multiple={false}
                      name={"filePreview"}
                      height={"145px"}
                    />
                  </FormGroup>
                </Col>
                

                <Col className="col-auto">
                  <FormGroup>
                    <Label>
                      {t("company-creator.select-categories-please")}
                    </Label>
                    <Col className="col-12 d-flex">
                      <Input type="text" id="category" />
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
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col className="col-12">
                  <h2>{t("common:formulary.location-of-the-company")}</h2>
                </Col>
              </Row>
              <Row className="row-cols-1 row-cols-md-2 g-3">
                <Col>
                  <FormGroup>
                    <Label for="province">{t("common:province")}</Label>
                    <Input
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
                      <FormText color="danger" className="error-label">
                        {errors.province.message}
                      </FormText>
                    )}
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label for="location">{t("common:location")}</Label>
                    <Input
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
                      <FormText color="danger" className="invalid error-label">
                        {errors.location.message}
                      </FormText>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button type="submit" color="primary mt-1">
                    {t("company-creator.add-company")}
                  </Button>
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
