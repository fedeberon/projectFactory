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

const CompanyCreator = () => {
  const [modalCompany, setModalCompany] = useState(false);
  const [session] = useSession();
  const { t } = useTranslation("common");
  const [previewImage, setPreviewImage] = useState([]);
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
        console.log("no es igual");
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

  const onSubmit = async ({ name }, event) => {
    name = name.toLowerCase().trim();
    // You should handle login logic with name, preview and background images and form data
    let data = {
      name,
    };

    if (name !== "") {
      if (previewImage.length != 0) {
        if (tagsCategories.length > 0) {
          await companyService.create(
            name,
            previewImage[0],
            tagsCategories,
            session?.accessToken
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
      {session?.authorities?.includes("ROLE_ADMINISTRATOR") && (
        <Button onClick={toggle}>{t("company-creator.add-company")}</Button>
      )}

      <ModalForm
        size={"md"}
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
                            nameInput: t("name").toLowerCase(),
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
