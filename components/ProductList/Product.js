import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardImg,
  CardText,
} from "reactstrap";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";

const Product = (props) => {
  const { product } = props;
  const { t } = useTranslation("common");
  return (
    <Card>
      <CardImg
        className="img-fluid"
        top
        src={product.previewImage}
        alt={product.name}
      />
      <CardBody>
        <CardText>{product.name}</CardText>
        <CardText>{product.company.contact}</CardText>
      </CardBody>
      <CardFooter className="d-flex justify-content-end">
        <Link
          href={`/product/[id]`}
          as={`/product/${product.name.replace(/\s+/g, "-")}-${product.id}`}
          passHref
        >
          <Button color={"primary"}>{t("view-more")}</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default Product;
