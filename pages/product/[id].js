import React from "react";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import Layout from "../../components/Layout/Layout";
import {
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Row,
} from "reactstrap";
import { getSession } from "next-auth/client";
import * as imageService from "../../services/imageService";
import * as productService from "../../services/productService";
import productStyle from "./product.module.css";

const ProductDetail = (props) => {
  const { data } = props;
  const { t } = useTranslation("common");

  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout title={`${t("product-detail")}`}>
      <Row>
        <Col className="col-12 col-md-2">
          <pre>{JSON.stringify(data.product, null, 2)}</pre>
        </Col>
        <Col className="col-12 col-md-10">
          <Card>
            <CardBody>
              <CardTitle tag="h5">{data.product.name}</CardTitle>
              <img
                className={productStyle.img}
                src={data.product.previewImage}
                alt=""
              />
              <CardText>Informacion del producto</CardText>
              <CardText>{data.product.description}</CardText>
              <CardText>{data.product.price}</CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        {data.images.map((image, index) => {
          return (
            <Col key={index}>
              <Card>
                <CardBody>
                  <img
                    className={productStyle.img}
                    src={image.path}
                    alt={image.typeImage}
                  />
                </CardBody>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Layout>
  );
};

export async function getServerSideProps({ params, req, res, locale }) {
  let images = [];
  let product = {};
  let token;
  let { page, size } = req.__NEXT_INIT_QUERY;
  let { id } = params; // params is necessary in case you reload the page from the url
  const split = id.split("-");
  let idSplit = split[split.length - 1];
  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }

  images = await imageService.getImagesByProductId(idSplit, page, size);
  product = await productService.getById(idSplit);

  return {
    props: {
      data: { images, product },
    },
  };
}

export default ProductDetail;
