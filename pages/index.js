// Frameworks
import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";
import { Col, Row } from "react-bootstrap";

// Components
import FilterList from "../components/FilterList/FilterList";
import FilteredImages from "../components/FilteredImages/FilteredImages";
import Layout from "../components/Layout/Layout";
import CarouselHome from "../components/CarouselHome/CarouselHome";
import SwiperEmpresas from "../components/Swiper/SwiperEmpresas/SwiperEmpresas";
import SwiperProducts from "../components/Swiper/SwiperProducts/SwiperProducts";
import AboutHome from "../components/AboutHome";

// Services
import * as tagService from "../services/tagService";
import * as imageService from "../services/imageService";
import * as productService from "../services/productService";
import * as companyService from "../services/companyService";

// Styles
import styles from "../styles/Home.module.css";
import CarouselImageCreator from "../components/CarouselImageCreator";
import AdministratorCreator from "../components/AdministratorCreator";
import OffCanvasFilter from "../components/OffCanvas/OffCanvasFilter.js/OffCanvasFilter";

const Home = ({ filters, carouselImages, session, products, companies }) => {
  const [filteredImages, setFilteredImages] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState({ page: 0, size: 10 });
  const [imagesCarousel, setImagesCarousel] = useState([]);

  let { t } = useTranslation("home");

  useEffect(async () => {
    const images = await getProfessionalsByTags();
    if (images) {
      setFilteredImages(images);
    }
  }, [appliedFilters]);

  const onAddCarouselImages = async () => {
    try {
      const carouselImages = await imageService.findCarouselImages();
      setImagesCarousel(carouselImages);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(async () => {
    if (carouselImages) {
      await onAddCarouselImages();
    }
  }, [carouselImages]);

  const getProfessionalsByTags = async () => {
    setLoading(true);
    try {
      const images = await imageService.getProfessionalImagesByTags(
        appliedFilters,
        pageSize.page,
        pageSize.size,
        session?.accessToken
      );
      setLoading(false);
      return images;
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <CarouselHome images={imagesCarousel} />
      <section className="container py-2">
        <Row className="row-cols-1 gap-2">
          <Col>
            <div className="my-4 d-flex">
              <CarouselImageCreator onAddCarouselImages={onAddCarouselImages} />
              <div className="mx-4">
                <AdministratorCreator />
              </div>
            </div>
          </Col>
          <Col>
            <Row>
              <Col>
                <OffCanvasFilter
                  filters={filters}
                  appliedFilters={appliedFilters}
                  setAppliedFilters={setAppliedFilters}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={9} xl={10}>
                <div className={styles.infoHead}>
                  <h2 className={styles.itemsTitle}>
                    {t("buildings")}
                    <small className={styles.itemsSmallTitle}>
                      {t("design-objects-for-your-spaces")}
                    </small>
                  </h2>
                </div>
                <FilteredImages isLoading={isLoading} images={filteredImages} />
              </Col>
            </Row>
          </Col>
          <AboutHome />
          <Col>
            <div className={styles.infoHead}>
              <h2 className={styles.productsTitle}>
                {t("products")}
                <small className={styles.productsSmallTitle}>
                  {t("products-description")}
                </small>
              </h2>
            </div>
            <SwiperProducts
              products={products}
              slidesPerViewMobile={{ dimensionLimit: 576, slides: 1 }}
              slidesPerViewTablet={{ dimensionLimit: 768, slides: 2 }}
              slidesPerViewDesktop={{ dimensionLimit: 992, slides: 4 }}
            />
          </Col>
          <Col>
            <div className={styles.infoHead}>
              <h2 className={styles.itemsTitle}>
                {t("professionals")}
                <small className={styles.itemsSmallTitle}>
                  {t("new-design-and-construction-professionals")}
                </small>
              </h2>
            </div>
            <SwiperEmpresas
              items={companies}
              slidesPerViewMobile={{ dimensionLimit: 576, slides: 1 }}
              slidesPerViewTablet={{ dimensionLimit: 768, slides: 2 }}
              slidesPerViewDesktop={{ dimensionLimit: 992, slides: 3 }}
            />
          </Col>
        </Row>
      </section>
    </Layout>
  );
};

export async function getServerSideProps({ params, req, res, locale }) {
  // Get the user's session based on the request
  const session = await getSession({ req });

  let { page, size } = req.__NEXT_INIT_QUERY;

  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }

  const filters = await tagService.findAll();
  const carouselImages = await imageService.findCarouselImages();
  const products = await productService.findAllByStatus(page, size, "APPROVED");
  const companies = await companyService.findAll("APPROVED", page, size);

  return {
    props: {
      filters: filters,
      carouselImages,
      session,
      companies,
      products,
    },
  };
}

export default Home;
