import React from "react";
import {
  Button,
  Card,
} from "react-bootstrap";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";

const Product = (props) => {
  const { product } = props;
  const { t } = useTranslation("common");
  return (
    <Card>
      <Card.Img
        className="img-fluid"
        top
        src={product.previewImage}
        alt={product.name}
      />
      <Card.Body>
        <Card.Text>{product.name}</Card.Text>
        <Card.Text>{product.company.contact}</Card.Text>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-end">
        <Link
          href={`/product/[id]`}
          as={`/product/${product.name.replace(/\s+/g, "-")}-${product.id}`}
          passHref
        >
          <Button variant={"primary"}>{t("view-more")}</Button>
        </Link>
      </Card.Footer>
    </Card>
  );
};

export default Product;
