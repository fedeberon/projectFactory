//Frameworks
import React, { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { Col, Row, Tabs, Tab } from "react-bootstrap";
import { GeoAlt } from "react-bootstrap-icons";
import { useSession, getSession } from "next-auth/client";

//Styles
import styles from "./slug.module.css";

//Components
import Layout from "../../components/Layout/Layout";
import MercadopagoButton from "../../components/Buttons/MercadopagoButton/MercadopagoButton";
import Product from "../../components/ProductList/Product";
import Plans from "../../components/Plans/Plans";
import PrimaryButton from "../../components/Buttons/PrimaryButton/PrimaryButton";
import ModalForm from "../../components/ModalForm";

//Services
import * as companyService from "../../services/companyService";
import * as professionalService from "../../services/professionalService";
import * as userService from "../../services/userService";
import * as productService from "../../services/productService";
import * as imageService from "../../services/imageService";
import SeeImagesLiked from "../../components/SeeImagesLiked/SeeImagesLiked";

const CompanyDetails = ({ company, initialProducts, status, session }) => {
  const { t } = useTranslation("common");
  const [products, setProducts] = useState(initialProducts);
  const [amountTokens, setAmountTokens] = useState(-1);
  const [imagesLiked, setImagesLiked] = useState([]);
  const [tabProfile, setTabProfile] = useState(<></>);
  const [statusPurchased, setStatusPurchased] = useState(status);
  const [showModalPlan, setShowModalPlan] = useState(status == "approved");

  useEffect( async () => {
    if (isOwner()) {
      const tokens = await userService.getAmountTokens(session.accessToken);
      setAmountTokens(tokens);
      const liked = await imageService.getLikePhotos(0, 99, session.accessToken);
      setImagesLiked(liked);
      
      const profileInfo = (
        <>
        <span>{company.description}</span>
        {isOwner() && (
          <div className="mt-4">
            <MercadopagoButton />
            <span className="d-block mt-4">{`${t(
              "profile:your-tokens"
              )}: ${tokens}`}</span>
            <PrimaryButton onClick={toggleModalPlan}>{t("profile:buy-more-tokens")}</PrimaryButton>
            <div className="mt-4">
              <SeeImagesLiked imagesLiked={liked} />
            </div>
          </div>
        )}
      </>
      );
    
      setTabProfile(profileInfo);
    } else {
      setTabProfile(<span>{company.description}</span>);
    }
  }, [company])

  const productsList = (
    <Row className="g-2">
      {products.map((product) => (
        <Col sm={6} md={6} lg={4} key={product.id}>
          <Product product={product} />
        </Col>
      ))}
    </Row>
  );

  const isOwner = () => {
    if (session) {
      return session.user.id == company.id;
    } else {
      return false;
    }
  };

  const toggleModalPlan = () => {
    setStatusPurchased("");
    setShowModalPlan(!showModalPlan);
  };

  const onBuyPlan = async (plan) => {
    const mp = new MercadoPago(
      process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY,
      { locale: 'es-AR' }
    );

    const preference = await professionalService.generatePreferenceForToken(plan, session.accessToken);
    mp.checkout(
    {
      preference: preference.id
    });
  
    const link = document.createElement("a");
    document.body.appendChild(link);
    link.href = preference.initPoint;
    link.setAttribute("type", "hidden");
    link.click();
  };

  return (
    <Layout>
      <section className="container content">
        <img
          src={company.backgroundImage}
          className={`w-100 ${styles.backgroundImage}`}
        />

        <div className={styles.header}>
          <div className="position-absolute">
            <div className={styles.logoContainer}>
              <img src={company.previewImage} className={styles.logo} />
            </div>
          </div>

          <div className={styles.companyName}>
            <h2>{company.name}</h2>
            <GeoAlt className={styles.locationIcon} />
            <span className={styles.location}>
              <span>{company.location}.</span> {company.province}
            </span>
          </div>
        </div>

        <section className={styles.section}>
          <Row>
            <Col sm={12} md={4} lg={3}>
              <aside className="boxdeg">
                <div>
                  <span className={styles.asideTitle}>{t("web-site")}</span>
                  <span>{company.email}</span>
                </div>

                <hr />

                <div>
                  <span className={styles.asideTitle}>
                    {t("categories")}
                  </span>
                  {company.categories.map((category, index) => (
                    <span key={index} className="d-block">
                      {category.name}
                    </span>
                  ))}
                </div>

                <hr />
              </aside>
            </Col>

            <Col sm={12} md={8} lg={9}>
              <Tabs
                defaultActiveKey="products"
                id="uncontrolled-tab-example"
                className={`${styles.tabs} mb-3`}
              >
                <Tab
                  eventKey="products"
                  title={
                    <h5>
                      <span className="badge">
                        {company.countProducts}
                      </span>{" "}
                      {t("products")}
                    </h5>
                  }
                >
                  <div className={styles.tabContent}>{productsList}</div>
                </Tab>

                <Tab eventKey="profile" title={<h5>{t("header.profile")}</h5>}>
                  <div className={styles.tabContent}>{tabProfile}</div>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </section>
      </section>

      <ModalForm
        size={"xl"}
        modalTitle={t("profile:formulary-plan.title")}
        className={"Button mt-50"}
        formBody={<Plans onBuyPlan={onBuyPlan} status={statusPurchased} />}
        modalOpen={{ open: showModalPlan, function: setShowModalPlan }}
      />
    </Layout>
  );
};

export async function getServerSideProps({ params, req, query, res, locale }) {
  let { slug } = params;
  const split = slug.split("-");
  const companyId = split[split.length - 1];
  const company = await companyService.findById(companyId);
  const initialProducts = await productService.getAllByCompanyId(
    companyId,
    0,
    10
  );



  const session = await getSession({ req });
  return {
    props: {
      company,
      initialProducts,
      status : query.status ? query.status : "",
      session,
    },
  };
}

export default CompanyDetails;
