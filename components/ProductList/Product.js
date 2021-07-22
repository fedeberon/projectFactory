import React, { useEffect } from "react";
import {
  Button,
  Card,
  CardImg,
} from "react-bootstrap";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import myProductsStyles from "../../pages/my-products/index.module.css";

const Product = (props) => {
  const { product } = props;
  const { t } = useTranslation("products");

  const isNew = (product) => {
    const today = new Date();
    const productDate = new Date(product.statusUpdate);
    const diffTime = Math.abs(today - productDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) -1;
    return process.env.NEXT_PUBLIC_TIME_FOR_NEW_PRODUCT_IN_DAYS >= diffDays;
  };

  useEffect(() => {
    isNew(product);
  }, [])

  return (
    <Card>
      <Card.Img
        className="img-fluid"
        src={product.previewImage}
        alt={product.name}
      />
      <Card.Body>
        {isNew(product) && 
        <Card.Text className={`${myProductsStyles.itemStatus} bg-warning text-dark m-0`}>
          {t("new")}
        </Card.Text>
        }
        <Card.Text>{product.name}</Card.Text>
        <Card.Text>{product.company.contact}</Card.Text>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-end">
        <Link
          href={`/product/[id]`}
          as={`/product/${product.name.replace(/\s+/g, "-")}-${product.id}`}
          passHref
        >
          <Button color={"primary"}>{t("common:view-more")}</Button>
        </Link>
      </Card.Footer>
    </Card>
  );
};

export default Product;
