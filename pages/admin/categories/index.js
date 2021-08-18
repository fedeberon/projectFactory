import React, { useState, useEffect, useMemo } from 'react';
import Layout from "../../../components/Layout/Layout";
import { Col, Form, Row } from "react-bootstrap";
import { getSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";
import DataTable from 'react-data-table-component';
import PrimaryButton from '../../../components/Buttons/PrimaryButton/PrimaryButton';
import * as categoryService from "../../../services/categoryService";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/client";

const AdminCategories = () => {
    const { t } = useTranslation("administrator");
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [session] = useSession();
    const {
        register,
        setError,
        formState: { errors },
        handleSubmit,
    } = useForm();

    const addPrettyTypeCategory = (categories) => {
        categories.forEach(category => {
            switch (category.typeCategory) {
                case "PRODUCT" : category.typeCategory = t("administrator-categories.category-type-product"); break;
                case "BUILDING_WORK": category.typeCategory = t("administrator-categories.category-type-building-work"); break;
                case "COMPANY" : category.typeCategory = t("administrator-categories.category-type-company"); break;
                case "MAGAZINE" : category.typeCategory = t("administrator-categories.category-type-magazine"); break;
            }
        });
    };

    useEffect( async () => {
        const categories = await categoryService.getCategories();
        addPrettyTypeCategory(categories);
        setCategories(categories);
        setIsLoading(false);
    }, []);
    
    const columns = useMemo(() => [
        {
            name: t('common:name'),
            selector: row => row.name,
            sortable: true,
        },
        {
            name: t('common:type-category'),
            selector: row => row.typeCategory,
            sortable: true,
        },
    ]);

    const handleSubmitCategory = async ({ name, typeCategory }) => {
        if (typeCategory !== "placeholder") {
            const category = { name, typeCategory };
            const categoryCreated = await categoryService.create(category, session.accessToken);
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
                            <Form.Label>{t("administrator-categories.category-name-label")}</Form.Label>
                            <Form.Control required type="text" {...register("name")} placeholder={t("administrator-categories.category-name-placeholder")} />
                        </Form.Group>
                    </Col>
                    <Col sm={12} md={5} lg={3}>
                        <Form.Group className="mb-3">
                            <Form.Label>{t("administrator-categories.category-type-label")}</Form.Label>
                            <Form.Select {...register("typeCategory", {required: {value: true,message:"as"}})}>
                                <option value="placeholder">{t("administrator-categories.category-type-placeholder")}</option>
                                <option value="PRODUCT">{t("administrator-categories.category-type-product")}</option>
                                <option value="BUILDING_WORK">{t("administrator-categories.category-type-building-work")}</option>
                                <option value="COMPANY">{t("administrator-categories.category-type-company")}</option>
                                <option value="MAGAZINE">{t("administrator-categories.category-type-magazine")}</option>
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

            <Form.Label className="mt-4">{t("administrator-categories.categories-table-label")}</Form.Label>
            <DataTable
                columns={columns}
                data={categories}
                progressPending={isLoading}
                pagination
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