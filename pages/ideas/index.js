// Frameworks
import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";
import { Col, Row } from "react-bootstrap";
import Link from "next/link";

// Components
import Layout from "../../components/Layout/Layout";
import FilteredImages from "../../components/FilteredImages/FilteredImages";
import OffCanvasFilter from "../../components/OffCanvas/OffCanvasFilter.js/OffCanvasFilter";

// Services
import * as tagService from "../../services/tagService";
import * as imageService from "../../services/imageService";
import * as productService from "../../services/productService";
import * as companyService from "../../services/companyService";

// Styles
import styles from "../../styles/Home.module.css";
import PrimaryButton from "../../components/Buttons/PrimaryButton/PrimaryButton";
import SpinnerCustom from "../../components/SpinnerCustom/SpinnerCustom";

const index = ({ filters, session, filtersTags }) => {
  const [filteredImages, setFilteredImages] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [pageSize, setPageSize] = useState({ page: 0, size: 10 });
  const [isLoading, setLoading] = useState(false);
  const [imagesLocal, setimagesLocal] = useState([]);

  let { t } = useTranslation("common");

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

  const changePage = () => {
    setPageSize({ page: pageSize.page + 1, size: 10 });
  };

  useEffect(async () => {
    const images = await getProfessionalsByTags();
    if (images) {
      setFilteredImages(images);
    }
  }, [appliedFilters]);

  useEffect(async () => {
    const images = await getProfessionalsByTags();
    if (images) {
      const newImages = filteredImages.concat(images);
      setFilteredImages(
        newImages.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
      );
    }
  }, [pageSize]);

  useEffect(() => {
    if (filtersTags != "") {
      filtersTags = [{ tag: filtersTags }];
      setAppliedFilters(filtersTags);
    }
  }, [filtersTags]);

  const fetchMoreData = () => {
    setTimeout(() => {
      changePage();
    }, 1500);
  };

  return (
    <Layout>
      <section className="container content">
        <Row className="row-cols-1 gap-2">
          <Col className={styles.infoHead}>
            <h2 className={styles.itemsTitle}>{t("facades")}</h2>
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
          </Col>
          <Col>
            <FilteredImages
              images={filteredImages}
              fetchMoreData={fetchMoreData}
            />
          </Col>
          {/* <Col>
            <PrimaryButton dark onClick={changePage}>
              {t("view-more")}
            </PrimaryButton>
          </Col> */}
        </Row>
      </section>
    </Layout>
  );
};

export async function getServerSideProps({ params, req, res, locale }) {
  // Get the user's session based on the request
  const session = await getSession({ req });

  let { page, size, filters } = req.__NEXT_INIT_QUERY;

  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }

  const imagesfilters = await tagService.findAll();

  return {
    props: {
      filters: imagesfilters,
      session,
      filtersTags: filters ? filters : "",
    },
  };
}

export default index;
