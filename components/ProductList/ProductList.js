import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import SpinnerCustom from "../SpinnerCustom/SpinnerCustom";
import Product from "./Product";

const ProductList = (props) => {
  const { products } = props;
  const [productsLocal, setProductsLocal] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (products) {
      setProductsLocal(products);
    }
  }, [products]);

  useEffect(() => {
    setLoading(false);
  }, [productsLocal])

  return (
    <Row className="row-cols-1 row-cols-md-2 row-cols-lg-3 g-2">
    
        {productsLocal.map((product) => 
        <Col key={product.id}>
          <Product product={product} />
        </Col>
        )}
    </Row>
  );
};

export default ProductList;
