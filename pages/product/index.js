//Frameworks
import React from "react";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { Row, Col } from "react-bootstrap";
import { useSelector } from 'react-redux';

//Components
import Layout from "../../components/Layout/Layout";
import ProductList from "../../components/ProductList/ProductList";
import Sidebar from "../../components/Sidebar/Sidebar";

//Services
import * as productService from "../../services/productService";
import ContentHeader from "../../components/ContentHeader/ContentHeader";

const Product = (props) => {
  const { data, category } = props;
  const categories = useSelector(state => state.categories.products);
  const { t } = useTranslation("common");

  return (
    <Layout>
      <section className="container content">
        <Row>
          <Sidebar>
            <h3>{t("products")}</h3>
            <ul>
              {categories.map((category, index) => (
                <li key={index}>
                  <Link
                    href={`/product?category=${category.name.replace(
                      /\s+/g,
                      "-"
                    )}`}
                  >
                    <a>{category.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </Sidebar>

          <Col sm={12} md={8} lg={9}>
            <ContentHeader title={category != "" ? category : t("products")} />

            <ProductList products={data} />
          </Col>
        </Row>
      </section>
    </Layout>
  );
};

export async function getServerSideProps({ req, query }) {
  // Get the user's session based on the request
  let products = [];
  let { page, size } = req.__NEXT_INIT_QUERY;
  let status = "APPROVED";
  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }
  let category;
  if (query.category) {
    category = query.category.replace(/-/g, " ");
    products = await productService.findAllByCategory(
      status,
      category,
      page,
      size
    );
  } else {
    products = await productService.findAll(status, page, size);
  }
  return {
    props: {
      data: products,
      category: category ? category : "",
    },
  };
}

export default Product;
