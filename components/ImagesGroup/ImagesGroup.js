// Frameworks
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Alert, Card, Col, Row } from "react-bootstrap";
import { useSession } from "next-auth/client";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import { Images, InfoCircleFill, PersonCircle } from "react-bootstrap-icons";
import useTranslation from "next-translate/useTranslation";

// Components
import SpinnerCustom from "../SpinnerCustom/SpinnerCustom";
import CustomButtonToggle from "../Buttons/CustomButtonToggle/CustomButtonToggle";

// Styles
import filteredImagesStyles from "../FilteredImages/FilteredImages.module.css";
import styles from "./ImagesGroup.module.css";

// Services
import * as buildingWorkService from "../../services/buildingWorkService";

const ImagesGroup = (props) => {
  const {
    isLoading,
    localBuildingWorks,
    editBuildingWork,
    fetchMoreData,
    limit = false,
    profileHidden,
    getTotalBuildingWorks,
  } = props;
  const [session] = useSession();
  const [hasMore, setHasMore] = useState(true);

  const { t } = useTranslation("common");

  // const getTotalBuildingWorksByProfessional = async () => {
  //   try {
  //     const total = await buildingWorkService.getCountByProfessional(
  //       session.user.id
  //     );
  //     return total;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const isState = (buildingWork) => {
    let statusColor;
    let ico;
    // if (product.status === "PENDING") {
    //   statusColor = `bg-warning text-dark`;
    //   ico = <ExclamationCircle className={`${statusColor}`} size={15} />;
    // }
    // if (product.status === "APPROVED") {
    //   statusColor = "bg-success";
    //   ico = <Check2Circle className={`${statusColor}`} size={15} />;
    // }
    // if (product.status === "REJECTED") {
    //   statusColor = `bg-danger`;
    //   ico = <XCircle className={`${statusColor}`} size={15} />;
    // }
    // return (
    //   <>
    //     <CardText className={`${indexStyles.itemStatus} ${statusColor} m-0`}>
    //       {ico}
    //       {t(product.status.toLowerCase())}
    //     </CardText>
    //   </>
    // );
  };

  const shimmer = (w, h) => `
  <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#EAEAEA" offset="20%" />
        <stop stop-color="#FFFFFF" offset="50%" />
        <stop stop-color="#EAEAEA" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#EAEAEA" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
  </svg>`;

  const toBase64 = (str) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str);

  useEffect(() => {
    console.group(
      "voy mostrando: ",
      localBuildingWorks.buildingWorks.length
    );
    // console.log("limit", limit);
    if (localBuildingWorks.buildingWorks.length > 0) {
      // const { count } = await getTotalBuildingWorks();
      // console.log("TOTAL:", count);
      // console.log("TOTAL:", localBuildingWorks.count);

      if (localBuildingWorks.buildingWorks.length == localBuildingWorks.count) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    }

    console.table(localBuildingWorks.buildingWorks);
    console.table(localBuildingWorks.count);
  }, [localBuildingWorks]);

  return (
    <Row className="w-100 m-0">
      {/* {isLoading ? (
        <SpinnerCustom />
      ) : ( */}
      <Col>
        {localBuildingWorks.buildingWorks.length === 0 ? (
          <Col xs={12}>
            <Alert
              variant="primary"
              className="d-flex justify-content-center gap-2 "
            >
              <InfoCircleFill size={25} />
              {`${t("table-admin.there-are-not-more")} `}
            </Alert>
          </Col>
        ) : (
          <InfiniteScroll
            className="row row-cols-1 row-cols-lg-2 row-cols-xl-3 g-4 "
            dataLength={localBuildingWorks.buildingWorks.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={!limit && <SpinnerCustom className="w-100 m-0 my-2" />}
            endMessage={
              !limit && (
                <Col xs={12}>
                  <Alert
                    variant="primary"
                    className="d-flex justify-content-center gap-2 "
                  >
                    <InfoCircleFill size={25} />
                    {`${t("yay-You-have-seen-it-all")}`}
                  </Alert>
                </Col>
              )
            }
          >
            {localBuildingWorks.buildingWorks.map((buildingWork, index) => (
              <Col key={index}>
                <Card className={`${filteredImagesStyles.colCard}`}>
                  <Card.Body
                    className={`${filteredImagesStyles.cardImage} p-0 `}
                  >
                    <Link
                      href={`/building/[id]`}
                      as={`/building/${buildingWork.name.replace(
                        /\s+/g,
                        "-"
                      )}-${buildingWork.id}`}
                    >
                      <a>
                        <Image
                          layout="fill"
                          objectFit="cover"
                          quality={50}
                          className={` cursor-pointer`}
                          src={buildingWork.previewImage}
                          alt="Professional preview"
                          placeholder="blur"
                          blurDataURL={`data:image/svg+xml;base64,${toBase64(
                            shimmer(700, 475)
                          )}`}
                        />
                      </a>
                    </Link>
                    {isState(buildingWork)}
                    <div className={`${filteredImagesStyles.cardText}`}>
                      {/* <Col className="col-auto">
                        <img
                          className={`${styles.imgProfile}`}
                          src={buildingWork?.professional?.previewImage}
                        />
                      </Col> */}
                      <Col className="col-auto">
                        {buildingWork.professional?.previewImage &&
                        !profileHidden ? (
                          <img
                            className={`${filteredImagesStyles.imgProfile} rounded-circle`}
                            src={buildingWork.professional.previewImage}
                          />
                        ) : buildingWork.professional && !profileHidden ? (
                          <PersonCircle size={50} />
                        ) : (
                          <img
                            className={`${filteredImagesStyles.imgProfile} invisible`}
                            // src={buildingWork.professional.previewImage}
                          />
                        )}
                      </Col>
                      <Col className={`col-auto`}>
                        <Card.Text
                          className={`${filteredImagesStyles.textShadowSm} ${styles.parrafoName} fw-bold`}
                        >
                          {buildingWork.name}
                        </Card.Text>
                        {!profileHidden && (
                          <Card.Text
                            className={`${filteredImagesStyles.textShadowSm} ${styles.parrafoName} fw-bold`}
                          >
                            {buildingWork.professional.contact}
                          </Card.Text>
                        )}
                      </Col>
                      <Col
                        className={`col-auto ${filteredImagesStyles.containerHeart}`}
                      >
                        {session && editBuildingWork ? (
                          <div>
                            <CustomButtonToggle
                              id={buildingWork.id}
                              editBuildingWork={editBuildingWork}
                              imageSize={buildingWork.countImages}
                            />
                          </div>
                        ) : (
                          <div style={{ width: "51px", height: "51px" }}>
                            <Images
                              className={`${filteredImagesStyles.heart}`}
                              color={"white"}
                              size={25}
                            />
                            {` ${buildingWork.countImages} Photos`}
                          </div>
                        )}
                      </Col>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </InfiniteScroll>
        )}
      </Col>
    </Row>
  );
};

export default ImagesGroup;
