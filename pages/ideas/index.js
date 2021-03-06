// Frameworks
import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";
import { Col, Row } from "react-bootstrap";

// Components
import Layout from "../../components/Layout/Layout";
import OffCanvasFilter from "../../components/OffCanvas/OffCanvasFilter.js/OffCanvasFilter";

// Services
import * as buildingWorkService from "../../services/buildingWorkService";

// Styles
// import styles from "../../styles/Home.module.css";
import styles from "./index.module.css";
import ImagesGroup from "../../components/ImagesGroup/ImagesGroup";
import BuildingWorkList from "../../components/BuildingWork/BuildingWorkList/BuildingWorkList";

const index = ({ session, filtersTags, buildingWorks }) => {
  const [appliedFilters, setAppliedFilters] = useState(filtersTags);
  const [pageSize, setPageSize] = useState({
    page: 1,
    size: process.env.NEXT_PUBLIC_SIZE_PER_PAGE,
  });
  const [countFirst, setCountFirst] = useState(false);

  const [isLoading, setLoading] = useState(false);
  const [localBuildingWorks, setLocalBuildingWorks] = useState(buildingWorks);

  let { t } = useTranslation("common");

  const changePage = () => {
    const { page } = { page: pageSize.page + 1 };
    setPageSize({ ...pageSize, page });
  };

  // const resetPage = () => {
  //   const { page } = { page: 0 };
  //   setPageSize({ ...pageSize, page });
  // };

  const onGetAllByCategoryAndStatus = async (status) => {
    // setLoading(true);
    try {
      const filterImages = await buildingWorkService.getAllByCategoryAndStatus(
        status,
        appliedFilters,
        pageSize.page,
        pageSize.size
      );
      // setLoading(false);
      return filterImages;
    } catch (error) {
      console.error(error);
      // setLoading(false);
    }
  };

  const fetchMoreData = () => {
    changePage();
  };

  // const getTotalBuildingWorks = async () => {
  //   const status = "APPROVED";
  //   try {
  //     const total = await buildingWorkService.getCount(status);
  //     return total;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // 1 llamada es este
  useEffect(async () => {
    if (countFirst) {
      setLocalBuildingWorks({ buildingWorks: [], count: 0 });
      setPageSize({
        page: 0,
        size: process.env.NEXT_PUBLIC_SIZE_PER_PAGE,
      });
    } else {
      setCountFirst(true);
    }
  }, [appliedFilters]);

  // el 2do llamada es este otro
  useEffect(async () => {
    const status = "APPROVED";
    const buildingWorks = await onGetAllByCategoryAndStatus(status);
    if (buildingWorks) {
      setLocalBuildingWorks({
        ...localBuildingWorks,
        buildingWorks: [
          ...localBuildingWorks.buildingWorks,
          ...buildingWorks.buildingWorks,
        ],
        count: buildingWorks.count,
      });
    }
  }, [pageSize]);

  useEffect(() => {
    setAppliedFilters(filtersTags);
  }, [filtersTags]);

  return (
    <Layout>
      <section className="container content">
        <Row className="row-cols-1 gap-4">
          <Col className={styles.headListPhotos}>
            <h1>
              {appliedFilters.length === 0 ? t("buildings") : appliedFilters[0]}
            </h1>
          </Col>
          <Col className={`col-auto px-4`}>
            <OffCanvasFilter
              classNameButton={`align-self-start justify-self-start`}
              appliedFilters={appliedFilters}
              setAppliedFilters={setAppliedFilters}
              classNameButton={`mx-auto`}
            />
          </Col>
          <Col className={`col-auto px-4 ms-auto ${styles.counter}`}>
            <p>{`${localBuildingWorks.count} ${t("photos")}`}</p>
          </Col>
          <Col>
            {/* <ImagesGroup
              localBuildingWorks={localBuildingWorks}
              fetchMoreData={fetchMoreData}
            /> */}
            <BuildingWorkList
              data={localBuildingWorks}
              fetchMoreData={fetchMoreData}
            />
          </Col>
        </Row>
      </section>
    </Layout>
  );
};

export async function getServerSideProps({ req }) {
  // Get the user's session based on the request
  const session = await getSession({ req });

  let { page, size, categories } = req.__NEXT_INIT_QUERY;

  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }

  const arrayCategories = [];
  let buildingWorks = { buildingWorks: [], count: 0 };
  const status = "APPROVED";
  let categoryReplace;
  if (categories != undefined) {
    categoryReplace = categories.replace(/-/g, " ");
    arrayCategories.push(categoryReplace);
    buildingWorks = await buildingWorkService.getAllByCategoryAndStatus(
      status,
      arrayCategories,
      page,
      size
    );
  } else {
    buildingWorks = await buildingWorkService.findAll(status, page, size);
  }
  return {
    props: {
      session,
      filtersTags: arrayCategories,
      buildingWorks: buildingWorks,
    },
  };
}

export default index;
