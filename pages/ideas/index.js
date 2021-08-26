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
import styles from "../../styles/Home.module.css";
import ImagesGroup from "../../components/ImagesGroup/ImagesGroup";
import SpinnerCustom from "../../components/SpinnerCustom/SpinnerCustom";

const index = ({ session, filtersTags, buildingWorks }) => {
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [pageSize, setPageSize] = useState({
    page: 1,
    size: process.env.NEXT_PUBLIC_SIZE_PER_PAGE,
  });

  // const [pageSizeFilter, setPageSizeFilter] = useState({
  //   page: 0,
  //   size: process.env.NEXT_PUBLIC_SIZE_PER_PAGE,
  // });

  const [isLoading, setLoading] = useState(false);
  const [localBuildingWorks, setLocalBuildingWorks] = useState(buildingWorks);
  const [localBuildingWorksFilter, setLocalBuildingWorksFilter] =
    useState(buildingWorks);

  let { t } = useTranslation("common");

  const changePage = () => {
    const { page } = { page: pageSize.page + 1 };
    setPageSize({ ...pageSize, page });
  };
  // const changePageFilter = () => {
  //   const { page } = { page: pageSizeFilter.page + 1 };
  //   setPageSizeFilter({ ...pageSizeFilter, page });
  // };

  const resetPage = () => {
    const { page } = { page: 1 };
    setPageSize({ ...pageSize, page });
  };

  // const resetPageFilter = () => {
  //   const { page } = { page: 0 };
  //   setPageSizeFilter({ ...pageSizeFilter, page });
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

  // const onGetAllByCategoryAndStatusFilter = async (status) => {
  //   // setLoading(true);
  //   try {
  //     const filterImages = await buildingWorkService.getAllByCategoryAndStatus(
  //       status,
  //       appliedFilters,
  //       pageSizeFilter.page,
  //       pageSizeFilter.size
  //     );
  //     // setLoading(false);
  //     return filterImages;
  //   } catch (error) {
  //     console.error(error);
  //     // setLoading(false);
  //   }
  // };

  // 1 llamada es este
  // useEffect(async () => {
  //   console.log("appliedFilters", appliedFilters);
  //   if (appliedFilters.length > 0) {
  //     const buildingWorks = await onGetAllByCategoryAndStatus("APPROVED");
  //     console.log("buildingWorks_Filtradas", buildingWorks);
  //     // resetPage();
  //     // setLocalBuildingWorks({ buildingWorks: [], count: 0 });
  //     setLocalBuildingWorksFilter(buildingWorks);
  //   }
  // }, [appliedFilters]);

  // el 2do llamada es este otro
  useEffect(async () => {
    // console.log("----------> efect pageSize <----------");
    // console.log("pageSize---", pageSize);
    const status = "APPROVED";
    const buildingWorks = await onGetAllByCategoryAndStatus("APPROVED");
    // console.log("onGetAllByCategoryAndStatus---", buildingWorks);
    // console.log(
    //   "onGetAllByCategoryAndStatus---",
    //   buildingWorks.buildingWorks.slice(buildingWorks.buildingWorks.length - 1)
    // );
    // console.log("//////////-> efect pageSize <-//////////");

    // console.log({
    //   ...localBuildingWorks,
    //   buildingWorks: [
    //     ...localBuildingWorks.buildingWorks,
    //     ...buildingWorks.buildingWorks,
    //   ],
    // });
    setLocalBuildingWorks({
      ...localBuildingWorks,
      buildingWorks: [
        ...localBuildingWorks.buildingWorks,
        ...buildingWorks.buildingWorks,
      ],
    });
  }, [pageSize]);

  // useEffect(async () => {
  //   console.log("----------> efect pageSize <----------");
  //   console.log("pageSize---", pageSize);
  //   const status = "APPROVED";
  //   const buildingWorks = await onGetAllByCategoryAndStatusFilter("APPROVED");
  //   console.log("onGetAllByCategoryAndStatusFILTER---", buildingWorks);
  //   // console.log(
  //   //   "onGetAllByCategoryAndStatus---",
  //   //   buildingWorks.buildingWorks.slice(buildingWorks.buildingWorks.length - 1)
  //   // );
  //   console.log("//////////-> efect pageSize <-//////////");

  //   // console.log({
  //   //   ...localBuildingWorks,
  //   //   buildingWorks: [
  //   //     ...localBuildingWorks.buildingWorks,
  //   //     ...buildingWorks.buildingWorks,
  //   //   ],
  //   // });
  //   setLocalBuildingWorksFilter({
  //     ...localBuildingWorksFilter,
  //     buildingWorks: [
  //       ...localBuildingWorksFilter.buildingWorks,
  //       ...buildingWorks.buildingWorks,
  //     ],
  //   });
  //   setLocalBuildingWorksFilter({ buildingWorks: [], count: 0 });
  // }, [pageSizeFilter]);

  // useEffect(() => {
  //   if (localBuildingWorks) {
  //     console.log(localBuildingWorks.count);
  //   }
  // }, [localBuildingWorks]);

  const fetchMoreData = () => {
    // setTimeout(() => {
    changePage();
    // console.log("FETCH_MORE_DATA pageSize---", pageSize);
    // }, 1500);
  };
  // const fetchMoreDataFilter = () => {
  //   // setTimeout(() => {
  //   changePageFilter();
  //   console.log("FETCH_MORE_DATA_FILTER pageSize---", pageSizeFilter);
  //   // }, 1500);
  // };

  // useEffect(async () => {
  //   if (buildingWorks) {
  //     console.log("buildingWorks getServerSideProps", buildingWorks);
  //     setLocalBuildingWorks(buildingWorks);
  //   }
  // }, [buildingWorks]);

  const getTotalBuildingWorks = async () => {
    const status = "APPROVED";
    try {
      const total = await buildingWorkService.getCount(status);
      return total;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (filtersTags) {
      setAppliedFilters([filtersTags]);
    }
  }, [filtersTags]);

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
                  appliedFilters={appliedFilters}
                  setAppliedFilters={setAppliedFilters}
                />
              </Col>
            </Row>
          </Col>
          <Col>
            {/* {isLoading ? (
              <SpinnerCustom />
            ) : ( */}
            {/* // <></> */}

            {/* {appliedFilters.length > 0 ? ( */}
            {/* <ImagesGroup
              isLoading={isLoading}
              localBuildingWorks={localBuildingWorksFilter}
              fetchMoreData={fetchMoreDataFilter}
              getTotalBuildingWorks={getTotalBuildingWorks}
            /> */}
            {/* ) : ( */}
            <ImagesGroup
              isLoading={isLoading}
              localBuildingWorks={localBuildingWorks}
              fetchMoreData={fetchMoreData}
              getTotalBuildingWorks={getTotalBuildingWorks}
            />
            {/* )} */}
            {/* )} */}
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
  if (categories != undefined) {
    arrayCategories.push(categories);
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
      filtersTags: categories ? categories : "",
      buildingWorks: buildingWorks,
    },
  };
}

export default index;
