// Frameworks
import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";
import { Col, Row } from "reactstrap";

// Components
import FilterList from "../components/FilterList/FilterList";
import FilteredImages from "../components/FilteredImages/FilteredImages";
import Layout from "../components/Layout/Layout";
import CarouselBanner from "../components/CustomCarousel/CarouselBanner";

// Services
import * as tagService from "../services/tagService";
import * as imageService from "../services/imageService";

// Styles
import styles from "../styles/Home.module.css";
import CompanyCreator from "../components/CompanyCreator/CompanyCreator";
import CarouselImageCreator from "../components/CarouselImageCreator";
import AdministratorCreator from "../components/AdministratorCreator";

const Home = ({ filters, carouselImages }) => {
  const [session] = useSession();
  const [filteredImages, setFilteredImages] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState({ page: 0, size: 10 });

  let { t } = useTranslation("home");

  useEffect(async () => {
    const images = await getProfessionalsByTags();
    if (images) {
      setFilteredImages(images);
    }
  }, [appliedFilters]);

  const getProfessionalsByTags = async () => {
    try {
      return await imageService.getProfessionalImagesByTags(
        appliedFilters,
        pageSize.page,
        pageSize.size,
        session?.accessToken
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout
      title={`${t("welcome-to")} ${process.env.NEXT_PUBLIC_PROJECT_NAME}`}
    >
      <CarouselBanner images={carouselImages} />
      <div className="my-4 d-flex">
        <CarouselImageCreator />
        <div className="mx-4">
          <AdministratorCreator />
        </div>
        <div className="mx-4">
          <CompanyCreator />
        </div>
      </div>
      <Row>
        <Col xs={12} md={3} xl={2}>
          <aside>
            <FilterList
              filters={filters}
              appliedFilters={appliedFilters}
              setAppliedFilters={setAppliedFilters}
            />
          </aside>
        </Col>
        <Col xs={12} md={9} xl={10}>
          <FilteredImages isLoading={isLoading} images={filteredImages} />
        </Col>
      </Row>
    </Layout>
  );
};

export async function getServerSideProps({ params, req, res, locale }) {
  // Get the user's session based on the request
  const session = await getSession({ req });

  const filters = await tagService.findAll();
  const carouselImages = await imageService.findCarouselImages();
  let { page, size } = req.__NEXT_INIT_QUERY;

  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }

  return {
    props: {
      filters: filters,
      carouselImages,
    },
  };
}

export default Home;
