import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import useTranslation from "next-translate/useTranslation";
import {
  Button,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
  Col,
} from "reactstrap";
import InputImages from "../InputImages/InputImages";
import Dropzone from "../Dropzone/Dropzone";
import ModalForm from "../ModalForm";
import FormTag from "../FormTag/FormTag";
import Error from "../Error";
import Select from "react-select";

const FormProfessional = ({
  onAddProfessional,
  toggle,
  error,
  setError,
  data,
}) => {
  const { t } = useTranslation("profile");
  const [previewImage, setPreviewImage] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState([]);
  const [images, setImages] = useState([]);
  const [modalTagOpen, setModalTagOpen] = useState(false);
  const [currentImageTag, setCurrentImageTag] = useState({});
  const [companyOptions, setCompanyOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [optionSelect, setOptionSelect] = useState(true);
  const [companySelected, setCompanySelected] = useState({});

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async (
    {
      company,
      contact,
      email,
      companyCategory,
      contactLoad,
      website,
      province,
      location,
    },
    event
  ) => {
    if (imagesHasTags()) {
      // You should handle login logic with firstName, lastName, email, preview and background images and form data
      let data = {
        company: companySelected,
        category: companyCategory,
        contact,
        email,
        contactLoad,
        website,
        previewImage: previewImage[0],
        backgroundImage: backgroundImage[0],
        images,
        province,
        location
      };
      const professional = await onAddProfessional(data);
      
      if (professional != null) {
        setPreviewImage([]);
        setBackgroundImage([]);
        event.target.reset();
        toggle();
        setError("");
      }
    } else {
      setError(t("TagsRequired"));
    }
  };

  const imagesHasTags = () => {
    const imagesWithoutTags = images.filter(img => img.tags.length == 0);
    return imagesWithoutTags.length == 0;
  };

  const toggleTagModal = () => setModalTagOpen(!modalTagOpen);

  const showTagModal = (img) => {
    setModalTagOpen(true);
    setCurrentImageTag(img);
  };

  useEffect(() => {
    if (data) {
      setCompanyOptions(data);
    }
  }, [data]);

  const seleccion = (value) => {
    if (value) {
      setCategoryOptions(value.categories);
      setCompanySelected(value);
      setOptionSelect(false);
    } else {
      setCategoryOptions([]);
      setCompanySelected({});
      setOptionSelect(true);
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="row-cols-1 g-4">
          <Col>
            <Row>
              <Col className="col-12">
                <h2>{t("formulary.professional-profile")}</h2>
              </Col>
            </Row>
            <Row className="row-cols-1 row-cols-md-2 row-cols-xl-4 g-3">
              <Col>
                <FormGroup>
                  <Label for="company">{t("formulary.company")}</Label>
                  <Controller
                    name="company"
                    control={control}
                    rules={{
                      required: {
                        value: optionSelect,
                        message: `${t("formulary.is-required", {
                          nameRequired: t("formulary.the-company"),
                        })}`,
                      },
                    }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        inputId={"company"}
                        options={companyOptions}
                        getOptionLabel={(option) => `${option?.name}`}
                        getOptionValue={(option) => `${option?.id}`}
                        isClearable
                        onChange={(value) => seleccion(value)}
                      />
                    )}
                  />
                  {errors.company && (
                    <FormText className="error-label">
                      {errors.company.message}
                    </FormText>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label for="contact">{t("formulary.contact")}</Label>
                  <Input
                    type="text"
                    name="contact"
                    id="contact"
                    placeholder={`${t("formulary.write-the-here-please", {
                      namePlaceholder: t("formulary.the-contact").toLowerCase(),
                    })}`}
                    {...register("contact", {
                      required: {
                        value: true,
                        message: `${t("formulary.is-required", {
                          nameRequired: t("formulary.the-contact"),
                        })}`,
                      },
                      minLength: {
                        value: 3,
                        message: `${t(
                          "formulary.cannot-be-less-than-character",
                          {
                            nameInput: t("formulary.contact").toLowerCase(),
                            numberCharacters: 3,
                          }
                        )}`,
                      },
                    })}
                    className={
                      "form-field" + (errors.contact ? " has-error" : "")
                    }
                  />
                  {errors.contact && (
                    <FormText className="invalid error-label text-danger">
                      {errors.contact.message}
                    </FormText>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label for="email">{t("formulary.contact-email")}</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder={t("formulary.write-the-here-please", {
                      namePlaceholder: t("formulary.the-contact-email").toLowerCase(),
                    })}
                    {...register("email", {
                      required: {
                        value: true,
                        message: `${t("formulary.is-required", {
                          nameRequired: t("formulary.the-contact-email"),
                        })}`,
                      },
                      minLength: {
                        value: 3,
                        message: `${t(
                          "formulary.cannot-be-less-than-character",
                          {
                            nameInput: t("formulary.contact-email").toLowerCase(),
                            numberCharacters: 3,
                          }
                        )}`,
                      },
                    })}
                    className={
                      "form-field" + (errors.email ? " has-error" : "")
                    }
                  />
                  {errors.email && (
                    <FormText className="error-label">
                      {errors.email.message}
                    </FormText>
                  )}
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label for="companyCategory">
                    {t("formulary.company-category")}
                  </Label>
                  <Controller
                    name="companyCategory"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: `${t("formulary.is-required", {
                          nameRequired: t("formulary.the-company-category"),
                        })}`,
                      },
                    }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        inputId={"companyCategory"}
                        options={categoryOptions}
                        getOptionLabel={(option) => `${option?.name}`}
                        getOptionValue={(option) => `${option?.id}`}
                        isClearable
                      />
                    )}
                  />
                  {errors.companyCategory && (
                    <FormText className="error-label">
                      {errors.companyCategory.message}
                    </FormText>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label for="contactLoad">
                    {t("formulary.contact-charge")}
                  </Label>
                  <Input
                    type="text"
                    name="contactLoad"
                    id="contactLoad"
                    placeholder={t("formulary.write-the-here-please", {
                      namePlaceholder: t(
                        "formulary.the-contact-charge"
                      ).toLowerCase(),
                    })}
                    {...register("contactLoad", {
                      required: {
                        value: true,
                        message: `${t("formulary.is-required", {
                          nameRequired: t("formulary.the-contact-charge"),
                        })}`,
                      },
                      minLength: {
                        value: 3,
                        message: `${t(
                          "formulary.cannot-be-less-than-character",
                          {
                            nameInput: t(
                              "formulary.contact-charge"
                            ).toLowerCase(),
                            numberCharacters: 3,
                          }
                        )}`,
                      },
                    })}
                    className={
                      "form-field" + (errors.contactLoad ? " has-error" : "")
                    }
                  />
                  {errors.contactLoad && (
                    <FormText className="invalid error-label">
                      {errors.contactLoad.message}
                    </FormText>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label for="website">{t("formulary.web-page")}</Label>
                  <Input
                    type="website"
                    name="website"
                    id="website"
                    placeholder={t("formulary.write-the-here-please", {
                      namePlaceholder: t(
                        "formulary.the-web-page"
                      ).toLowerCase(),
                    })}
                    {...register("website", {
                      required: {
                        value: true,
                        message: `${t("formulary.is-required", {
                          nameRequired: t("formulary.the-web-page"),
                        })}`,
                      },
                      minLength: {
                        value: 3,
                        message: `${t(
                          "formulary.cannot-be-less-than-character",
                          {
                            nameInput: t("formulary.web-page").toLowerCase(),
                            numberCharacters: 3,
                          }
                        )}`,
                      },
                    })}
                    className={
                      "form-field" + (errors.website ? " has-error" : "")
                    }
                  />
                  {errors.website && (
                    <FormText className="error-label">
                      {errors.website.message}
                    </FormText>
                  )}
                </FormGroup>
              </Col>
              <Col>
                <FormGroup className="text-center">
                  <Label for="file">
                    {t("formulary.select-profile-picture")}
                  </Label>
                  <Dropzone
                    newFiles={previewImage}
                    setFile={setPreviewImage}
                    accept={"image/*"}
                    multiple={false}
                    name={"images"}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup className="text-center">
                  <Label for="file">
                    {t("formulary.select-background-picture")}
                  </Label>
                  <Dropzone
                    newFiles={backgroundImage}
                    setFile={setBackgroundImage}
                    accept={"image/*"}
                    multiple={false}
                    name={"images"}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Col>
          <Col>
            <Row>
              <Col className="col-12">
                <h2>{t("formulary.location-of-the-company")}</h2>
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
                    placeholder={t("formulary.write-the-here-please", {
                      namePlaceholder: t(
                        "formulary.the-province"
                      ).toLowerCase(),
                    })}
                    {...register("province", {
                      required: {
                        value: true,
                        message: `${t("formulary.is-required", {
                          nameRequired: t("formulary.the-province"),
                        })}`,
                      },
                      minLength: {
                        value: 3,
                        message: `${t(
                          "formulary.cannot-be-less-than-character",
                          {
                            nameInput: t("common:province").toLowerCase(),
                            numberCharacters: 3,
                          }
                        )}`,
                      },
                    })}
                    className={
                      "form-field" + (errors.province ? " has-error" : "")
                    }
                  />
                  {errors.province && (
                    <FormText className="error-label">
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
                    placeholder={t("formulary.write-the-here-please", {
                      namePlaceholder: t(
                        "formulary.the-location"
                      ).toLowerCase(),
                    })}
                    {...register("location", {
                      required: {
                        value: true,
                        message: `${t("formulary.is-required", {
                          nameRequired: t("formulary.the-location"),
                        })}`,
                      },
                      minLength: {
                        value: 3,
                        message: `${t(
                          "formulary.cannot-be-less-than-character",
                          {
                            nameInput: t("common:location").toLowerCase(),
                            numberCharacters: 3,
                          }
                        )}`,
                      },
                    })}
                    className={
                      "form-field" + (errors.location ? " has-error" : "")
                    }
                  />
                  {errors.location && (
                    <FormText className="invalid error-label">
                      {errors.location.message}
                    </FormText>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col className="p-0">
                <FormGroup className="text-center">
                  <Label for="uploadFiles">
                    {t("common:upload-images")}
                  </Label>
                  <InputImages
                    accept={"image/*"}
                    multiple={true}
                    imagesEdited={setImages}
                    withTags={true}
                    onAdd={showTagModal}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Button type="submit" color="primary mt-1">
              {t("common:send")}
            </Button>
          </Col>
        </Row>
      </Form>
      <ModalForm
        className={"Button"}
        modalTitle={t("common:add-tags")}
        formBody={<FormTag image={currentImageTag} toggle={toggleTagModal} />}
        modalOpen={{ open: modalTagOpen, function: setModalTagOpen }}
      />
      {error && <Error error={error} />}
    </div>
  );
};

export default FormProfessional;
