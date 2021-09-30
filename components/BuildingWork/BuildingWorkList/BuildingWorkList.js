import React, { useState, useEffect } from "react";

import { Col, Row } from "react-bootstrap";
import { getSession, useSession } from "next-auth/client";

import InfiniteScroll from "react-infinite-scroll-component";
import { Camera, InfoCircleFill, PersonCircle } from "react-bootstrap-icons";
import useTranslation from "next-translate/useTranslation";

// Components
import SpinnerCustom from "../../SpinnerCustom/SpinnerCustom";
import CustomButtonToggle from "../../Buttons/CustomButtonToggle/CustomButtonToggle";

// Services
import * as buildingWorkService from "../../../services/buildingWorkService";

// Styles
import styles from "./BuildingWorkList.module.css";
import BuildingWork from "../BuildingWork/BuildingWork";
import AlertCustom from "../../Alert/AlertCustom";

const BuildingWorkList = (props) => {
  const {
    data,
    limit = false,
    profileHidden = false,
    editBuildingWork,
    fetchMoreData
  } = props;
  const [session] = useSession();
  const { t } = useTranslation("common");

  // const [pageSize, setPageSize] = useState({ page: 0, size: 10 });
  // const [localBuildingWorks, setLocalBuildingWorks] = useState(data);
  const [hasMore, setHasMore] = useState(true);

  // const changePage = () => {
  //   const { page } = { page: pageSize.page + 1 };
  //   setPageSize({ ...pageSize, page });
  // };

  // const fetchMoreData = () => {
  //   setTimeout(() => {
  //     changePage();
  //   }, 1500);
  // };

  useEffect(() => {
    if (data.buildingWorks.length > 0) {
      if (data.buildingWorks.length == data.count) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    }
  }, [data]);

  return (
    <Row className="w-100 m-0">
      <Col>
        {data.buildingWorks.length === 0 ? (
          <Col xs={12}>
            <AlertCustom themeDark>
              <InfoCircleFill size={25} />
              {`${t("table-admin.there-are-not-more")} `}
            </AlertCustom>
          </Col>
        ) : (
          <InfiniteScroll
            className="row row-cols-1 row-cols-md-2 row-cols-xl-3 "
            dataLength={data.buildingWorks.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={!limit && <SpinnerCustom className="w-100 m-0 my-2" />}
            endMessage={
              !limit && (
                <Col xs={12} className="mt-4">
                  <AlertCustom themeDark>
                    <InfoCircleFill size={25} />
                    {`${t("yay-You-have-seen-it-all")}`}
                  </AlertCustom>
                </Col>
              )
            }
          >
            {data.buildingWorks.map((buildingWork, index) => (
              <Col key={index} className="mb-4">
                <BuildingWork
                  buildingWork={buildingWork}
                  profileHidden={profileHidden}
                  editBuildingWork={editBuildingWork}
                />
              </Col>
            ))}
          </InfiniteScroll>
        )}
      </Col>
    </Row>
  );
};

export default BuildingWorkList;
