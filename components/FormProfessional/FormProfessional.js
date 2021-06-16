import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
  const { t, lang } = useTranslation("common");
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
                <h2>{t("ProfessionalProfile")}</h2>
              </Col>
            </Row>
            <Row className="row-cols-1 row-cols-md-2 row-cols-xl-4 g-3">
              <Col>
                <FormGroup>
                  <Label for="company">{t("Company")}</Label>
                  <Controller
                    name="company"
                    control={control}
                    rules={{
                      required: {
                        value: optionSelect,
                        message: `${t("CompanyIsRequired")}`,
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
                  <Label for="contact">{t("Contact")}</Label>
                  <Input
                    type="text"
                    name="contact"
                    id="contact"
                    placeholder={t("WriteTheContactHerePlease")}
                    {...register("contact", {
                      required: {
                        value: true,
                        message: `${t("ContactIsRequired")}`,
                      },
                      minLength: {
                        value: 3,
                        message: `${t("ContactCannotBeLessThan3Character")}`,
                      },
                    })}
                    className={
                      "form-field" + (errors.contact ? " has-error" : "")
                    }
                  />
                  {errors.contact && (
                    <FormText className="invalid error-label">
                      {errors.contact.message}
                    </FormText>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label for="email">{t("ContactEmail")}</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder={t("WriteTheEmailHerePlease")}
                    {...register("email", {
                      required: {
                        value: true,
                        message: `${t("EmailIsRequired")}`,
                      },
                      minLength: {
                        value: 3,
                        message: `${t("EmailCannotBeLessThan3Character")}`,
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
                  <Label for="companyCategory">{t("CompanyCategory")}</Label>
                  <Controller
                    name="companyCategory"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: `${t("CompanyCategoryIsRequired")}`,
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
                  <Label for="contactLoad">{t("ContactCharge")}</Label>
                  <Input
                    type="text"
                    name="contactLoad"
                    id="contactLoad"
                    placeholder={t("WriteTheContactChargeHerePlease")}
                    {...register("contactLoad", {
                      required: {
                        value: true,
                        message: `${t("ContactChargeIsRequired")}`,
                      },
                      minLength: {
                        value: 3,
                        message: `${t(
                          "Contact charge cannot be less than 3 character"
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
                  <Label for="website">{t("WebPage")}</Label>
                  <Input
                    type="website"
                    name="website"
                    id="website"
                    placeholder={t("WriteTheWebPageHerePlease")}
                    {...register("website", {
                      required: {
                        value: true,
                        message: `${t("WebPageIsRequired")}`,
                      },
                      minLength: {
                        value: 3,
                        message: `${t("WebPageCannotBeLessThan3Character")}`,
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
                  <Label for="file">{t("SelectProfilePicture")}</Label>
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
                  <Label for="file">{t("SelectBackgroundPicture")}</Label>
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
                <h2>{t("LocationOfTheCompany")}</h2>
              </Col>
            </Row>
            <Row className="row-cols-1 row-cols-md-2 g-3">
              <Col>
                <FormGroup>
                  <Label for="province">{t("Province")}</Label>
                  <Input
                    type="text"
                    name="province"
                    id="province"
                    placeholder={t("WriteTheProvinceHerePlease")}
                    {...register("province", {
                      required: {
                        value: true,
                        message: `${t("ProvinceIsRequired")}`,
                      },
                      minLength: {
                        value: 3,
                        message: `${t("ProvinceCannotBeLessThan3Character")}`,
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
                  <Label for="location">{t("Location")}</Label>
                  <Input
                    type="text"
                    name="location"
                    id="location"
                    placeholder={t("WriteTheNameHerePlease")}
                    {...register("location", {
                      required: {
                        value: true,
                        message: `${t("LocationIsRequired")}`,
                      },
                      minLength: {
                        value: 3,
                        message: `${t(
                          "Location cannot be less than 3 character"
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
                  <Label for="uploadFiles">{t("UploadImages")}</Label>
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
              {t("Send")}
            </Button>
          </Col>
        </Row>
      </Form>
      <ModalForm
        className={"Button"}
        modalTitle={t("AddTags")}
        formBody={<FormTag image={currentImageTag} toggle={toggleTagModal} />}
        modalOpen={{ open: modalTagOpen, function: setModalTagOpen }}
      />
      {error && <Error error={error} />}
    </div>
  );
};

export default FormProfessional;
