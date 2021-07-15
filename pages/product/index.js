//Frameworks
import React from "react";
import { getSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";

//Components
import Layout from "../../components/Layout/Layout";
import ProductList from "../../components/ProductList/ProductList";

//Services
import * as productService from "../../services/productService";

const Product = (props) => {
  const { data } = props;
  const { t } = useTranslation("common");

  return (
    <Layout title={t("product")}>
      <ProductList products={data} />
    </Layout>
  );
};

export async function getServerSideProps({ params, req, res, locale }) {
  // Get the user's session based on the request
  const session = await getSession({ req });

  let products = [];
  let { page, size } = req.__NEXT_INIT_QUERY;
  let status = "APPROVED";
  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }

  products = await productService.findAll(status, page, size);

  return {
    props: {
      data: products,
    },
  };
}

export default Product;
