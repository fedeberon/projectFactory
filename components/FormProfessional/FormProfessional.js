import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/client";
import { useForm, Controller } from "react-hook-form";
import useTranslation from "next-translate/useTranslation";
import {
  Button,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import Dropzone from "../Dropzone/Dropzone";
import ModalForm from "../ModalForm";
import FormTag from "../FormTag/FormTag";
import Error from "../Error";
import Select from "react-select";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

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
  const [modalTagOpen, setModalTagOpen] = useState(false);
  const [currentImageTag, setCurrentImageTag] = useState({});
  const [companyOptions, setCompanyOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [optionSelect, setOptionSelect] = useState(true);
  const [companySelected, setCompanySelected] = useState({});
  const [value, setValue] = useState();
  const [session] = useSession();

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      email: session.user.email ? session.user.email : "",
      contact: session.user.name ? session.user.name : "",
    },
  });

  const onSubmit = async (
    {
      company,
      contact,
      email,
      telephone,
      companyCategory,
      contactLoad,
      website,
      province,
      location,
    },
    event
  ) => {
    // You should handle login logic with firstName, lastName, email, preview and background images and form data
    let data = {
      company: companySelected,
      category: companyCategory,
      contact,
      email,
      phoneNumber: telephone,
      contactLoad,
      website,
      previewImage: previewImage[0],
      backgroundImage: backgroundImage[0],
      province,
      location,
    };
    const professional = await onAddProfessional(data);

    if (professional != null) {
      setPreviewImage([]);
      setBackgroundImage([]);
      event.target.reset();
      toggle();
      setError("");
    }
  };

  const toggleTagModal = () => setModalTagOpen(!modalTagOpen);

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
                <h2>{t("common:formulary.professional-profile")}</h2>
              </Col>
            </Row>
            <Row className="row-cols-1 row-cols-md-2 row-cols-xl-4 g-3">
              <Col>
                <Form.Group>
                  <Form.Label htmlFor="company">{t("common:formulary.company")}</Form.Label>
                  <Controller
                    name="company"
                    control={control}
                    rules={{
                      required: {
                        value: optionSelect,
                        message: `${t("common:is-required", {
                          nameRequired: t("common:formulary.the-company"),
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
                        className={
                          "form-field" +
                          (errors.company && optionSelect ? " has-error" : "")
                        }
                      />
                    )}
                  />
                  {errors.company && optionSelect && (
                    <Form.Text variant="danger" className="error-label">
                      {errors.company.message}
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="contact">{t("common:formulary.contact")}</Form.Label>
                  <Controller
                    type="text"
                    name="contact"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: `${t("common:is-required", {
                          nameRequired: t("common:formulary.the-contact"),
                        })}`,
                      },
                      minLength: {
                        value: 3,
                        message: `${t("common:cannot-be-less-than-character", {
                          nameInput: t("common:formulary.the-contact"),
                          numberCharacters: 3,
                        })}`,
                      },
                    }}
                    defaultValue=""
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="text"
                        id="contact"
                        placeholder={`${t("common:write-the-here-please", {
                          namePlaceholder: t(
                            "common:formulary.the-contact"
                          ).toLowerCase(),
                        })}`}
                        className={
                          "form-field" + (errors.email ? " has-error" : "")
                        }
                      />
                    )}
                  />
                  {errors.contact && (
                    <Form.Text
                      variant="danger"
                      className="invalid error-label text-danger"
                    >
                      {errors.contact.message}
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="email">
                    {t("common:formulary.contact-email")}
                  </Form.Label>
                  <Controller
                    type="email"
                    name="email"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: `${t("common:is-required", {
                          nameRequired: t("common:formulary.the-contact-email"),
                        })}`
                      },
                      minLength: {
                        value: 3,
                        message: `${t("common:cannot-be-less-than-character", {
                          nameInput: t("common:formulary.the-contact-email"),
                          numberCharacters: 3,
                        })}`,
                      },
                    }}
                    defaultValue=""
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="email"
                        id="email"
                        placeholder={t("common:write-the-here-please", {
                          namePlaceholder: t(
                            "common:formulary.the-contact-email"
                          ).toLowerCase(),
                        })}
                        className={
                          "form-field" + (errors.email ? " has-error" : "")
                        }
                      />
                    )}
                  />
                  {errors.email && (
                    <Form.Text variant="danger" className="error-label">
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
                        value: 3,
                        message: `${t("common:cannot-be-less-than-character", {
                          nameInput: t("common:formulary.the-telephone"),
                          numberCharacters: 3,
                        })}`,
                      },
                    })}
                    className={
                      "form-field" + (errors.telephone ? " has-error" : "")
                    }
                  />
                  {errors.telephone && (
                    <Form.Text variant="danger" className="error-label">
                      {errors.telephone.message}
                    </Form.Text>
                  )}
                </Form.Group>
                {/* <PhoneInput
                  placeholder="Enter phone number"
                  value={value}
                  onChange={setValue}
                /> */}
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label htmlFor="companyCategory">
                    {t("common:formulary.company-category")}
                  </Form.Label>
                  <Controller
                    name="companyCategory"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: `${t("common:is-required", {
                          nameRequired: t(
                            "common:formulary.the-company-category"
                          ),
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
                        className={
                          "form-field" +
                          (errors.companyCategory ? " has-error" : "")
                        }
                      />
                    )}
                  />
                  {errors.companyCategory && (
                    <Form.Text variant="danger" className="error-label">
                      {errors.companyCategory.message}
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
                    placeholder={t("common:write-the-here-please", {
                      namePlaceholder: t(
                        "common:formulary.the-contact-charge"
                      ).toLowerCase(),
                    })}
                    {...register("contactLoad", {
                      required: {
                        value: true,
                        message: `${t("common:is-required", {
                          nameRequired: t(
                            "common:formulary.the-contact-charge"
                          ),
                        })}`,
                      },
                      minLength: {
                        value: 3,
                        message: `${t("common:cannot-be-less-than-character", {
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
                    <Form.Text variant="danger" className="invalid error-label">
                      {errors.contactLoad.message}
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="website">{t("common:formulary.web-page")}</Form.Label>
                  <Form.Control
                    type="website"
                    name="website"
                    id="website"
                    placeholder={t("common:write-the-here-please", {
                      namePlaceholder: t(
                        "common:formulary.the-web-page"
                      ).toLowerCase(),
                    })}
                    {...register("website", {
                      required: {
                        value: true,
                        message: `${t("common:is-required", {
                          nameRequired: t("common:formulary.the-web-page"),
                        })}`,
                      },
                      minLength: {
                        value: 3,
                        message: `${t("common:cannot-be-less-than-character", {
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
                    <Form.Text variant="danger" className="error-label">
                      {errors.website.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="text-center">
                  <Form.Label htmlFor="file">
                    {t("common:formulary.select-profile-picture")}
                  </Form.Label>
                  <Dropzone
                    newFiles={previewImage}
                    setFile={setPreviewImage}
                    accept={"image/*"}
                    multiple={false}
                    name={"images"}
                    height={"123px"}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="text-center">
                  <Form.Label htmlFor="file">
                    {t("common:formulary.select-background-picture")}
                  </Form.Label>
                  <Dropzone
                    newFiles={backgroundImage}
                    setFile={setBackgroundImage}
                    accept={"image/*"}
                    multiple={false}
                    name={"images"}
                    height={"123px"}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Col>
          <Col>
            <Button type="submit" variant="primary mt-1">
              {t("common:send")}
            </Button>
          </Col>
        </Row>
      </Form>
      <ModalForm
        size={"xl"}
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
