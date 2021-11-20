import React, { useEffect } from "react";
import Link from "next/link";
import { Card, Col, Container, Row } from "react-bootstrap";
import Image from "next/image";
import { Camera, InfoCircleFill, PersonCircle } from "react-bootstrap-icons";
import useTranslation from "next-translate/useTranslation";
import { useSession } from "next-auth/client";

// Styles
import styles from "./BuildingWork.module.css";
import CustomButtonToggle from "../../Buttons/CustomButtonToggle/CustomButtonToggle";

const BuildingWork = (props) => {
  const { buildingWork, profileHidden = false, editBuildingWork } = props;
  
  const [session] = useSession();

  const { t } = useTranslation("common");

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

  return (
    <>
      <Row>
        <Col>
          <Card className={`${styles.colCard}`}>
            <Card.Body className={`${styles.cardImage} p-0 `}>
              <Link
                href={`/building/[id]`}
                as={`/building/${buildingWork?.name.replace(/\s+/g, "-")}-${
                  buildingWork?.id
                }`}
              >
                <a>
                  <Image
                    layout="fill"
                    objectFit="cover"
                    quality={50}
                    // width={"100%"}
                    // height={"100%"}
                    className={`cursor-pointer`}
                    src={buildingWork?.previewImage}
                    alt="Professional preview"
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(
                      shimmer(700, 475)
                    )}`}
                  />
                </a>
              </Link>
              {isState(buildingWork)}
            </Card.Body>
          </Card>

          <Row
            className={`row-cols-3 ${styles.cardText} ${styles.info} w-100 m-0 justify-content-between align-items-center gap-1`}
          >
            {buildingWork?.professional?.previewImage && !profileHidden ? (
              <Col className="col-auto p-0">
                <img
                  className={`${styles.imgProfile} rounded-circle`}
                  src={buildingWork?.professional.previewImage}
                />
              </Col>
            ) : buildingWork?.professional && !profileHidden ? (
              <Col className="col-auto p-0">
                <PersonCircle size={50} />
              </Col>
            ) : (
              <></>
              // <img
              //   className={`${styles.imgProfile} invisible`}
              //   // src={buildingWork.professional.previewImage}
              // />
            )}
            <Col
              className={`${
                !profileHidden ? `col-7 col-md-8` : `col-9`
              }  p-0 ${styles.name}`}
            >
              <div
                className={`${styles.parrafoName} ${styles.nameBuildingWork} `}
              >
                {buildingWork?.name}
              </div>
              {!profileHidden && (
                <h5
                  className={`${styles.parrafoName} ${styles.nameProfessional}`}
                >
                  {buildingWork?.professional.contact}
                </h5>
              )}
            </Col>
            <Col className={`col-auto p-0 ${styles.containerHeart}`}>
              {session && editBuildingWork ? (
                <div>
                  <CustomButtonToggle
                    id={buildingWork?.id}
                    editBuildingWork={editBuildingWork}
                    imageSize={buildingWork?.countImages}
                  />
                </div>
              ) : (
                <div className={`${styles.photos}`}>
                  {/* <Images
                  className={`${styles.heart}`}
                  color={"white"}
                  size={25}
                /> */}
                  <Image
                    src={`/icon-camera.svg`}
                    width={17}
                    height={15}
                    alt=""
                    // className={`${styles.svg}`}
                  />{" "}
                  {/* <Camera size={25} /> */}
                  <div>
                    {`${buildingWork?.countImages} ${t(
                      "photos"
                    ).toLocaleLowerCase()}`}
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default BuildingWork;
