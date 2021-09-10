// Frameworks
import React, { useState, useEffect, useMemo } from "react";
import { getSession, useSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { PencilSquare, X } from "react-bootstrap-icons";
import DataTable from "react-data-table-component";
import { useForm } from "react-hook-form";

// Components
import Layout from "../../../components/Layout/Layout";
import PrimaryButton from "../../../components/Buttons/PrimaryButton/PrimaryButton";
import ModalButton from "../../../components/Buttons/ModalButton/ModalButton";

// Services
import * as categoryService from "../../../services/categoryService";

const FormEdit = (props) => {
  const { category, onEditCategory } = props;
  const [session] = useSession();

  const { t } = useTranslation("administrator");

  const [defaultValue, setDefaultValue] = useState(category.name);

  const {
    register,
    setError,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();

  const onSubmitEdit = async ({ nameEdit }, event) => {
    nameEdit = nameEdit.trim();
    let data = {
      name: nameEdit,
    };
    if (nameEdit !== "") {
      const categoryEdited = await onEditCategory(
        category.id,
        data,
        session.accessToken
      );

      setDefaultValue(categoryEdited.name);
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
                {category.name} - {category.typeCategory}
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
            {errors.name && (
              <Form.Text
                variant="danger"
                className="invalid error-label text-danger"
              >
                {errors.name.message}
              </Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col className="mt-2">
          <PrimaryButton dark type="submit" variant="primary mt-1">
            {t("common:edit")}
          </PrimaryButton>
        </Col>
      </Row>
    </Form>
  );
};

const AdminCategories = () => {
  const { t } = useTranslation("administrator");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [errorCustom, setErrorCustom] = useState("");
  const [nameDefaultValue, setNameDefaultValue] = useState("as");
  const [session] = useSession();
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    setError,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();

  const addPrettyTypeCategory = (categories) => {
    categories.forEach((category) => {
      switch (category.typeCategory) {
        case "PRODUCT":
          category.typeCategory = t(
            "administrator-categories.category-type-product"
          );
          break;
        case "BUILDING_WORK":
          category.typeCategory = t(
            "administrator-categories.category-type-building-work"
          );
          break;
        case "COMPANY":
          category.typeCategory = t(
            "administrator-categories.category-type-company"
          );
          break;
        case "MAGAZINE":
          category.typeCategory = t(
            "administrator-categories.category-type-magazine"
          );
          break;
        case "PROFESSIONAL":
          category.typeCategory = t("common:professional");
          break;
      }
    });
  };

  useEffect(async () => {
    const categories = await categoryService.getCategories();
    addPrettyTypeCategory(categories);
    setCategories(categories);
    setIsLoading(false);
  }, []);

  const onEditCategory = async (id, data, token) => {
    try {
      const categoryEdited = await categoryService.editById(id, data, token);

      const categoriesEdited = categories.map((category) => {
        if (category.id !== categoryEdited.id) {
          return category;
        } else {
          return categoryEdited;
        }
      });

      setCategories(categoriesEdited);
      return categoryEdited;
    } catch (error) {
      console.error(error);
    }
  };
  // useEffect(() => {
  //   console.log("nameDefaultValue", nameDefaultValue);
  //   setNameDefaultValue(nameDefaultValue);
  // }, [nameDefaultValue]);

  // const toggle = (nameDefaultValue) => {
  //   setNameDefaultValue("");
  //   setNameDefaultValue(nameDefaultValue);
  //   setShowModal(!showModal);
  // };

  const columns = useMemo(() => [
    {
      name: t("common:name"),
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: t("common:type-category"),
      selector: (row) => row.typeCategory,
      sortable: true,
    },
    {
      name: t("common:category-button"),
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
              <FormEdit category={row} onEditCategory={onEditCategory} />
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

  const handleSubmitCategory = async ({ name, typeCategory }) => {
    if (typeCategory !== "placeholder") {
      const category = { name, typeCategory };
      const categoryCreated = await categoryService.create(
        category,
        session.accessToken
      );
      const newCategories = [...categories, categoryCreated];
      addPrettyTypeCategory(newCategories);
      setCategories(newCategories);
    } else {
      setError("typeCategory");
    }
  };

  return (
    <Layout title={t("managing-categories")}>
      <section className="container py-2">
        <Row>
          <Col>
            <Form onSubmit={handleSubmit(handleSubmitCategory)}>
              <Row>
                <Col sm={12} md={7} lg={9}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      {t("administrator-categories.category-name-label")}
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      {...register("name")}
                      placeholder={t(
                        "administrator-categories.category-name-placeholder"
                      )}
                    />
                  </Form.Group>
                </Col>
                <Col sm={12} md={5} lg={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      {t("administrator-categories.category-type-label")}
                    </Form.Label>
                    <Form.Select
                      {...register("typeCategory", {
                        required: { value: true, message: "as" },
                      })}
                    >
                      <option value="placeholder">
                        {t(
                          "administrator-categories.category-type-placeholder"
                        )}
                      </option>
                      <option value="PRODUCT">
                        {t("administrator-categories.category-type-product")}
                      </option>
                      <option value="BUILDING_WORK">
                        {t(
                          "administrator-categories.category-type-building-work"
                        )}
                      </option>
                      <option value="COMPANY">
                        {t("administrator-categories.category-type-company")}
                      </option>
                      <option value="MAGAZINE">
                        {t("administrator-categories.category-type-magazine")}
                      </option>
                      <option value="PROFESSIONAL">
                        {t("common:professional")}
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
                  </Form.Group>
                </Col>
              </Row>
              <PrimaryButton variant="primary" type="submit">
                {t("administrator-categories.add-category")}
              </PrimaryButton>
            </Form>

            <Form.Label className="mt-4">
              {t("administrator-categories.categories-table-label")}
            </Form.Label>
            <DataTable
              columns={columns}
              data={categories}
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

export default AdminCategories;
