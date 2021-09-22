// Frameworks
import React from "react";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import {
  Badge,
  Button,
  Card,
  CardImg,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import { Share, Envelope, GeoAlt } from "react-bootstrap-icons";

// Components
import Layout from "../../components/Layout/Layout";
import PrimaryButton from "../../components/Buttons/PrimaryButton/PrimaryButton";

// Services
import * as imageService from "../../services/imageService";
import * as productService from "../../services/productService";
import * as mercadopagoService from "../../services/mercadopagoService";

// Styles
import productStyle from "./product.module.css";
import Link from "next/link";
import SwiperProductsImages from "../../components/Swiper/SwiperProductsImages/SwiperProductsImages";

const ProductDetail = (props) => {
  const [session] = useSession();
  const { data, status } = props;
  const { t } = useTranslation("common");

  const router = useRouter();
  const { id } = router.query;

  const buyProduct = async (id) => {
    const mp = new MercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY, {
      locale: "es-AR",
    });

    const preference = await mercadopagoService.createPreferenceToProduct(
      id,
      session.accessToken
    );

    mp.checkout({
      preference: preference.id,
    });

    const link = document.createElement("a");
    document.body.appendChild(link);
    link.href = preference.initPoint;
    link.setAttribute("type", "hidden");
    link.click();
  };

  return (
    <Layout>
      <Container className="content">
        <Row className="w-100 gap-2 gap-lg-0 m-0">
          <Col className="col-sm-12 col-md-12 col-lg-9 order-lg-2">
            <Row
              className={`row-cols-1 justify-content-between align-items-center py-2 ${productStyle.borderTop}`}
            >
              <Col className="col-auto">
                <h1 className={`${productStyle.titObraDetail}`}>
                  {data.product.name}
                </h1>
              </Col>
              <Col className="col-auto">
                <PrimaryButton>
                  <Share size={15} /> {t("shared")}
                </PrimaryButton>
              </Col>
            </Row>
            <Row>
              <Col className="col-12 col-sm-7">
                <SwiperProductsImages
                  products={data.images}
                  slidesPerViewMobile={{ dimensionLimit: 576, slides: 1 }}
                  slidesPerViewTablet={{ dimensionLimit: 768, slides: 1 }}
                  slidesPerViewDesktop={{ dimensionLimit: 992, slides: 1 }}
                />
              </Col>
              <Col className="col-12 col-sm-5">
                <h2 className={`${productStyle.tit}`}>
                  {t("product-information")}
                </h2>
                <Col>
                  <p>{data.product.description}</p>
                  {/* <p>{`${t("price")}: $${data.product.price}`}</p> */}
                  <p>
                    {t("width")}: {data.product.width} cm / {t("height")}:{" "}
                    {data.product.height} cm / {t("depth")}{" "}:{data.product.depth}{" "}
                    cm
                  </p>
                </Col>
                <Col>
                  <div className="d-grid gap-2 w-50">
                    <PrimaryButton dark style={{ width: "200px" }}>
                      <Envelope size={20} /> {t("consult")}
                    </PrimaryButton>
                    {/* {session ? (
                      <PrimaryButton
                        onClick={() => buyProduct(data.product.id)}
                        style={{ width: "200px" }}
                      >
                        {t("buy-online")}
                      </PrimaryButton>
                    ) : (
                      <>
                      <Link href="/logIn">
                        <PrimaryButton style={{ width: "200px" }}>
                          {t("buy-online")}
                        </PrimaryButton>
                      </Link>
                      </>
                    )} */}
                    {status == "approved" && (
                      <div className="alert alert-success" role="alert">
                        {`${t("product-purchased")}`}
                      </div>
                    )}
                  </div>
                </Col>
                <Col>
                  <span className="leyenda">
                    {t("in-the-seller-is-online-shop")}
                  </span>
                </Col>
              </Col>
            </Row>
          </Col>
          <Col className="col-sm-12 col-md-12 col-lg-3 order-lg-1">
            <Col
              className={`${productStyle.boxDeg} p-4 d-flex flex-column gap-2`}
            >
              <h3 className={`${productStyle.titName}`}>
                {data.product.company.name}
              </h3>
              <h3 className={`${productStyle.titProjects}`}>
                <Badge className={`${productStyle.badge}`} bg="" text="dark">
                  {data.product.company.countProducts}
                </Badge>
                {t("products")}
              </h3>
              <h3 className={`${productStyle.location} p-0 d-flex gap-2`}>
                <GeoAlt size={15} />
                {`${data.product.company.location}, ${data.product.company.province}`}
              </h3>

              <Link
                href={`/companies/${data.product.company.name.replace(
                  /\s+/g,
                  "-"
                )}-${data.product.company.id}`}
                passHref
              >
                <PrimaryButton className={`me-auto`}>
                  {t("view-more")}
                </PrimaryButton>
              </Link>
            </Col>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export async function getServerSideProps({ params, req, res, locale, query }) {
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
      status: query.status ? query.status : "",
    },
  };
}

export default ProductDetail;
