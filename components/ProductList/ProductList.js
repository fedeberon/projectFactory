import React, { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import Product from "./Product";

const ProductList = (props) => {
  const { products } = props;
  const [productsLocal, setProductsLocal] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (products) {
      setProductsLocal(products);
    }
  }, [products]);

  return (
    <Row className="row-cols-3 g-2">
      {isLoading ? (
        <h1>{t("loading")}...</h1>
      ) : (
        productsLocal.map((product) => {
          return (
            <Col key={product.id}>
              <Product product={product} />
            </Col>
          );
        })
      )}
    </Row>
  );
};

export default ProductList;
