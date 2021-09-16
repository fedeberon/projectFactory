// Frameworks
import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";
import { ButtonGroup, Col, Row } from "react-bootstrap";
import Link from "next/link";

// Components
import FilterList from "../components/FilterList/FilterList";
import FilteredImages from "../components/FilteredImages/FilteredImages";
import Layout from "../components/Layout/Layout";
import SwiperCarouselHome from "../components/Swiper/SwiperCarouselHome/SwiperCarouselHome";
import AboutHome from "../components/AboutHome/AboutHome";
import SwiperEmpresas from "../components/Swiper/SwiperEmpresas/SwiperEmpresas";
import SwiperProducts from "../components/Swiper/SwiperProducts/SwiperProducts";

// Services
import * as tagService from "../services/tagService";
import * as imageService from "../services/imageService";
import * as productService from "../services/productService";
import * as companyService from "../services/companyService";
import * as buildingWorkService from "../services/buildingWorkService";
import * as magazineService from "../services/magazineService";

// Styles
import styles from "../styles/Home.module.css";
import CarouselImageCreator from "../components/CarouselImageCreator";
import AdministratorCreator from "../components/AdministratorCreator";
import OffCanvasFilter from "../components/OffCanvas/OffCanvasFilter.js/OffCanvasFilter";
import PrimaryButton from "../components/Buttons/PrimaryButton/PrimaryButton";
import ImagesGroup from "../components/ImagesGroup/ImagesGroup";
import SwiperMagazine from "../components/Swiper/SwiperMagazine/SwiperMagazine";

const Home = ({
  buildingWorks,
  carouselImages,
  session,
  products,
  companies,
  magazines,
}) => {
  const [filteredImages, setFilteredImages] = useState([]);
  // const [appliedFilters, setAppliedFilters] = useState([]);
  const [localBuildingWorks, setLocalBuildingWorks] = useState(buildingWorks);
  const [pageSize, setPageSize] = useState({ page: 0, size: 10 });
  const [isLoading, setLoading] = useState(false);
  const [imagesCarousel, setImagesCarousel] = useState([]);

  let { t } = useTranslation("home");

  // useEffect(async () => {
  //   const images = await getProfessionalsByTags();
  //   if (images) {
  //     setFilteredImages(images);
  //   }
  // }, [appliedFilters]);

  const onGetCarouselImages = async () => {
    try {
      const carouselImages = await imageService.findCarouselImages();
      setImagesCarousel(carouselImages);
    } catch (error) {
      console.error(error);
    }
  };

  const onDeleteCarouselImage = async (imageId) => {
    try {
      await imageService.deleteCarouselImage(imageId, session.accessToken);
      await onGetCarouselImages();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(async () => {
    if (carouselImages) {
      await onGetCarouselImages();
    }
  }, [carouselImages]);

  const getTotalBuildingWorks = async () => {
    const status = "APPROVED";
    try {
      const total = await buildingWorkService.getCount(status);
      return total;
    } catch (error) {
      console.error(error);
    }
  };

  const changePage = () => {
    const { page } = { page: pageSize.page + 1 };
    setPageSize({ ...pageSize, page });
  };

  const fetchMoreData = () => {
    setTimeout(() => {
      changePage();
    }, 1500);
  };

  useEffect(async () => {
    if (buildingWorks) {
      setLocalBuildingWorks(buildingWorks);
    }
  }, [buildingWorks]);

  useEffect(() => {
    console.log("magazines", magazines);
  }, [magazines]);

  return (
    <Layout>
      <SwiperCarouselHome
        images={imagesCarousel}
        onDeleteCarouselImage={onDeleteCarouselImage}
      />
      <section className="container py-5">
        <Row className="row-cols-1 gap-2">
          <Col>
            <ButtonGroup aria-label="Basic example" className="gap-1">
              <CarouselImageCreator onGetCarouselImages={onGetCarouselImages} />
              <AdministratorCreator />
            </ButtonGroup>
          </Col>
          <Col>
            <Row className="row-cols-1 gap-2">
              <Col className={styles.infoHead}>
                <h2 className={styles.tit}>
                  {t("buildings")}
                  <small className={styles.itemsSmallTitle}>
                    {t("design-objects-for-your-spaces")}
                  </small>
                </h2>
              </Col>
              <Col>
                {/* <FilteredImages images={filteredImages} limit={true} /> */}
                <ImagesGroup
                  isLoading={isLoading}
                  localBuildingWorks={localBuildingWorks}
                  fetchMoreData={fetchMoreData}
                  getTotalBuildingWorks={getTotalBuildingWorks}
                  limit={true}
                />
              </Col>
              <div className="w-100">
                <Link href="/ideas">
                  <PrimaryButton className="mx-auto my-4">
                    {t("common:view-more")}
                  </PrimaryButton>
                </Link>
              </div>
            </Row>
          </Col>
        </Row>
      </section>
      <AboutHome />
      <section className="container-fluid py-5">
        <Col>
          <Row className="row-cols-1 gap-2">
            <Col className={`${styles.infoHead} ${styles.info}`}>
              <h2 className={styles.productsTitle}>
                {t("common:products")}
                <small className={styles.productsSmallTitle}>
                  {t("products-description")}
                </small>
              </h2>
            </Col>
            <Col>
              <SwiperProducts
                products={products}
                slidesPerViewMobile={{ dimensionLimit: 576, slides: 1 }}
                slidesPerViewTablet={{ dimensionLimit: 768, slides: 2 }}
                slidesPerViewDesktop={{ dimensionLimit: 992, slides: 4 }}
              />
            </Col>
          </Row>
        </Col>
      </section>
      <section className={`container-fluid py-5 ${styles.backgroundGray}`}>
        <Col>
          <Row className="row-cols-1 gap-2">
            <Col className={styles.infoHead}>
              <h2 className={styles.tit}>
                {t("common:companies")}
                <small className={styles.itemsSmallTitle}>
                  {t("new-design-and-construction-companies")}
                </small>
              </h2>
            </Col>
            <Col>
              <SwiperEmpresas
                items={companies}
                slidesPerViewMobile={{ dimensionLimit: 576, slides: 1 }}
                slidesPerViewTablet={{ dimensionLimit: 768, slides: 2 }}
                slidesPerViewDesktop={{ dimensionLimit: 992, slides: 3 }}
              />
            </Col>
          </Row>
        </Col>
      </section>
      <section className={`container-fluid py-5`}>
        <Col>
          <div className={styles.infoHead}>
            <h2 className={styles.tit}>
              {t("common:magazine")}
              <small className={styles.itemsSmallTitle}>
                {t("new-design-architecture-and-deco")}
              </small>
            </h2>
          </div>
        </Col>
        <Col>
          <SwiperMagazine
            items={magazines}
            slidesPerViewMobile={{ dimensionLimit: 576, slides: 1 }}
            slidesPerViewTablet={{ dimensionLimit: 768, slides: 2 }}
            slidesPerViewDesktop={{ dimensionLimit: 992, slides: 3 }}
          />
        </Col>
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

  const status = "APPROVED";
  // const filters = await tagService.findAll();
  const carouselImages = await imageService.findCarouselImages();
  const products = await productService.findAllByStatus(page, size, status);
  const companies = await companyService.findAll(status, page, size);
  const magazines = await magazineService.findAll(status, page, size);
  const buildingWorks = await buildingWorkService.getAllByCategoryAndStatus(
    status,
    [],
    page,
    process.env.NEXT_PUBLIC_BUILDING_WORKS_PER_HOME
  );

  return {
    props: {
      buildingWorks: buildingWorks,
      carouselImages,
      session,
      companies,
      products,
      magazines,
    },
  };
}

export default Home;
