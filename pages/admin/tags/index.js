import React, { useState, useEffect, useMemo } from "react";
import { getSession, useSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";
import DataTable from "react-data-table-component";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { PencilSquare } from "react-bootstrap-icons";

// Components
import Layout from "../../../components/Layout/Layout";
import PrimaryButton from "../../../components/Buttons/PrimaryButton/PrimaryButton";
import SpinnerCustom from "../../../components/SpinnerCustom/SpinnerCustom";
import ModalButton from "../../../components/Buttons/ModalButton/ModalButton";

// Services
import * as tagService from "../../../services/tagService";

const FormEdit = (props) => {
  const { tag, onEditTag, isLoadingButton } = props;
  const [session] = useSession();

  const { t } = useTranslation("administrator");

  const [defaultValue, setDefaultValue] = useState(tag.name);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmitEdit = async ({ nameEdit }, event) => {
    nameEdit = nameEdit.trim();
    let data = {
      name: nameEdit,
    };
    if (nameEdit !== "") {
      const tagEdited = await onEditTag(tag.id, data, session.accessToken);

      setDefaultValue(tagEdited.name);
      event.target.reset();
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmitEdit)}>
      <Row className="row-cols-1 g-4">
        <Col>
          <Row>
            <Col className="col-12">
              <h3 className={`text-break`}>
                {tag.name} - {t(`${tag.typeCategory.toLowerCase()}`)}
              </h3>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label htmlFor="nameEdit">{t("common:name")}</Form.Label>
            <Form.Control
              type="text"
              id="nameEdit"
              defaultValue={defaultValue}
              className={"form-field" + (errors.name ? " has-error" : "")}
              style={{ resize: "none" }}
              {...register("nameEdit", {
                required: {
                  value: true,
                  message: `${t("common:is-required", {
                    nameRequired: t("common:the-name"),
                  })}`,
                },
                minLength: {
                  value: 3,
                  message: `${t("common:cannot-be-less-than-character", {
                    nameInput: t("common:the-name"),
                    numberCharacters: 3,
                  })}`,
                },
                maxLength: {
                  value: 255,
                  message: `${t("common:cannot-be-more-than-character", {
                    nameInput: t("common:name").toLowerCase(),
                    numberCharacters: 255,
                  })}`,
                },
              })}
            />
            {errors.nameEdit && (
              <Form.Text
                variant="danger"
                className="invalid error-label text-danger"
              >
                {errors.nameEdit.message}
              </Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col className="mt-2">
          {isLoadingButton ? (
            <SpinnerCustom />
          ) : (
            <PrimaryButton dark type="submit" variant="primary mt-1">
              {t("common:edit")}
            </PrimaryButton>
          )}
        </Col>
      </Row>
    </Form>
  );
};

const TagAdmin = (props) => {
  // const { tags } = props;
  const { t } = useTranslation("administrator");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [tags, setTags] = useState([]);
  const [session] = useSession();

  const selectedCategories = useSelector((state) => state.tags.typeTags);

  const selectedCategoriesDefault = useSelector(
    (state) => state.tags.selectedTypeTags
  );

  const {
    control,
    register,
    setError,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();

  const handleSubmitCategory = async ({ name, tags }, event) => {
    const data = {
      name,
      typeTag: tags.name,
    };
    setIsLoadingButton(true);
    try {
      const newCategory = await tagService.addTag(data, session.accessToken);
      if (newCategory) {
        setTags([...tags, newCategory]);
        event.target.reset();
        event.target[0].focus();
      }
      setIsLoadingButton(false);
    } catch (error) {
      console.error(error);
      setIsLoadingButton(false);
    }
  };

  const columns = useMemo(() => [
    {
      name: t("common:name"),
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: t("common:type-tag"),
      selector: (row) => t(`${row.typeCategory.toLowerCase()}`),
      sortable: true,
    },
    {
      name: t("common:tag-button"),
      button: true,
      right: true,
      cell: (row) => (
        <>
          <ModalButton
            buttonProps={{
              classNameButton: `text-nowrap px-3`,
              children: (
                <>
                  <PencilSquare size={20} />
                  {t("common:edit")}
                </>
              ),
            }}
            nameDefaultValue={row.name}
            modalTitle={t(`common:edit`)}
            modalBody={
              <FormEdit
                tag={row}
                onEditTag={onEditTag}
                isLoadingButton={isLoadingButton}
              />
            }
          />
        </>
      ),
    },
  ]);

  const paginationOptions = {
    rowsPerPageText: t("common:rows-per-page"),
    rangeSeparatorText: t("common:of"),
    selectAllRowsItem: true,
    selectAllRowsItemText: t("common:all"),
  };

  useEffect(async () => {
    const tags = await tagService.findAll();
    setTags(tags);
    setIsLoading(false);
  }, []);

  const onEditTag = async (id, data, token) => {
    setIsLoadingButton(true);
    try {
      const tagEdited = await tagService.editById(id, data, token);

      const tagsEdited = tags.map((tag) => {
        if (tag.id !== tagEdited.id) {
          return tag;
        } else {
          return tagEdited;
        }
      });

      setTags(tagsEdited);
      setIsLoadingButton(false);
      return tagEdited;
    } catch (error) {
      console.error(error);
      setIsLoadingButton(false);
    }
  };

  return (
    <Layout title={t("managing-tags")}>
      <section className="container py-2">
        <Row>
          <Col>
            <Form onSubmit={handleSubmit(handleSubmitCategory)}>
              <Row>
                <Col sm={12} md={7} lg={9}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t("tag-name-label")}</Form.Label>
                    <Form.Control
                      type="text"
                      id="name"
                      placeholder={t("tag-name-placeholder")}
                      {...register("name", {
                        required: {
                          value: true,
                          message: `${t("common:is-required", {
                            nameRequired: t("common:the-name"),
                          })}`,
                        },
                        minLength: {
                          value: 3,
                          message: `${t(
                            "common:cannot-be-less-than-character",
                            {
                              nameInput: t("common:the-name"),
                              numberCharacters: 3,
                            }
                          )}`,
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
                </Col>
                <Col sm={12} md={5} lg={3}>
                  {/* <Form.Group className="mb-3">
                    <Form.Label>
                      {t("administrator-categories.category-type-label")}
                    </Form.Label>
                    <Form.Select
                      {...register("typeCategory", {
                        required: { value: true, message: "as" },
                      })}
                    >
                      <option value="BUILDING_WORK">
                        {t(
                          "administrator-categories.category-type-building-work"
                        )}
                      </option>
                    </Form.Select>
                    {errors.typeCategory && (
                      <Form.Text
                        variant="danger"
                        className="invalid error-Form.Label text-danger"
                      >
                        {t("administrator-categories.category-type-required")}
                      </Form.Text>
                    )}
                  </Form.Group> */}
                  <Form.Group className={`mb-2`}>
                    <Form.Label htmlFor="tags">
                      {t("tag-type-label")}
                    </Form.Label>
                    <Controller
                      name="tags"
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
                          inputId={"tags"}
                          defaultValue={selectedCategoriesDefault}
                          options={selectedCategories}
                          getOptionLabel={(option) =>
                            `${t(`${option.name.toLowerCase()}`)}`
                          }
                          getOptionValue={(option) => `${option.id}`}
                          isClearable
                          className={
                            "form-field" + (errors.tags ? " has-error" : "")
                          }
                        />
                      )}
                    />
                    {errors.tags && (
                      <Form.Text
                        variant="danger"
                        className="invalid error-Form.Label text-danger"
                      >
                        {errors.tags.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              {isLoadingButton ? (
                <SpinnerCustom />
              ) : (
                <>
                  <PrimaryButton variant="primary" type="submit">
                    {t("add-tag")}
                  </PrimaryButton>
                </>
              )}
            </Form>

            <Form.Label className="mt-4">{t("tag-table-label")}</Form.Label>
            <DataTable
              columns={columns}
              data={tags}
              progressPending={isLoading}
              pagination
              paginationComponentOptions={paginationOptions}
              highlightOnHover
            />
          </Col>
        </Row>
      </section>
    </Layout>
  );
};

export async function getServerSideProps({ req }) {
  // Get the user's session based on the request
  const session = await getSession({ req });

  if (
    !session ||
    !session.authorities.includes(process.env.NEXT_PUBLIC_ROLE_ADMINITRATOR)
  ) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default TagAdmin;
