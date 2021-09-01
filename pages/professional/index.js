// Frameworks
import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";
import { Alert, Button, Card, Col, Row } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";

// Components
import Layout from "../../components/Layout/Layout";
import SpinnerCustom from "../../components/SpinnerCustom/SpinnerCustom";

// Services
import * as professionalService from "../../services/professionalService";

// Store
// import { professionalActions } from "../../store";

// Styles
import styles from "./index.module.css";
import { InfoCircleFill, PersonCircle } from "react-bootstrap-icons";
import useSize from "../../hooks/window/useSize";

const Professional = ({ data }) => {
  const { width, height } = useSize();
  const [sizeIco, setSizeIco] = useState(176);
  const [pageSize, setPageSize] = useState({
    page: 1,
    size: process.env.NEXT_PUBLIC_SIZE_PER_PAGE,
  });
  const [hasMore, setHasMore] = useState(true);
  const [professionals, setProfessionals] = useState(data);

  // const dispatch = useDispatch();
  // const professionals = useSelector((state) =>
  //   Object.values(state.professionals.items)
  // );

  const { t } = useTranslation("professional");

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
    // console.log(width);
    if (width >= 1400) {
      setSizeIco(248);
    } else if (width >= 1200) {
      setSizeIco(212);
    } else if (width >= 992) {
      setSizeIco(265);
    } else if (width >= 768) {
      // Tablet 768px
      setSizeIco(402);
    } else if (width >= 576) {
      setSizeIco(294);
    } else if (width >= 425) {
      // Mobile L 425px
      setSizeIco(225);
    } else if (width >= 375) {
      // Mobile M 375px
      setSizeIco(195);
    } else if (width >= 320) {
      // Mobile S 320px
      setSizeIco(162);
    }
  }, [width]);

  const changePage = () => {
    const { page } = { page: pageSize.page + 1 };
    setPageSize({ ...pageSize, page });
  };

  const fetchMoreData = () => {
    setTimeout(() => {
      changePage();
    }, 1500);
  };

  const onFindAll = async () => {
    try {
      const professionals = await professionalService.findAll(
        pageSize.page,
        pageSize.size
      );
      return professionals;
    } catch (error) {
      console.error(error);
    }
  };

  const getTotalProfessionals = async () => {
    const status = "APPROVED";
    try {
      const total = await professionalService.getCount(status);
      return total;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(async () => {
    const newProfesionals = await onFindAll();
    if (newProfesionals) {
      setProfessionals([...professionals, ...newProfesionals]);
    }
  }, [pageSize]);

  useEffect(async () => {
    if (professionals.length > 0) {
      const total = await getTotalProfessionals();
      console.log("professionals.length", professionals.length);
      console.log("total", total);
      if (professionals.length == total.count) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    }
  }, [professionals]);

  // useEffect(() => {
  //   console.log("data", data);
  //   // dispatch(professionalActions.store(data));
  // }, [data]);

  return (
    <Layout title={`${t("common:professional")}`}>
      <section className="container py-2">
        <Row className="w-100 m-0">
          <InfiniteScroll
            className="row row-cols-1 row-cols-lg-2 row-cols-xl-3 g-4 "
            dataLength={professionals.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<SpinnerCustom className="w-100 m-0 my-2" />}
            endMessage={
              <Col xs={12}>
                <Alert
                  variant="primary"
                  className="d-flex justify-content-center gap-2 "
                >
                  <InfoCircleFill size={25} />
                  {`${t("common:yay-You-have-seen-it-all")}`}
                </Alert>
              </Col>
            }
          >
            {professionals.map((professional, index) => (
              <Col key={index}>
                <Card className={`${styles.card}`}>
                  <Card.Body className={`p-0`}>
                    <Row className={`row-cols-1 w-100 m-0`}>
                      <Col xs={12} className={`p-0 text-center`}>
                        {professional.previewImage ? (
                          <Image
                            layout="responsive"
                            width={350}
                            height={210}
                            quality={50}
                            className={` cursor-pointer ${styles.img}`}
                            src={professional.previewImage}
                            alt="Professional preview"
                            placeholder="blur"
                            blurDataURL={`data:image/svg+xml;base64,${toBase64(
                              shimmer(350, 210)
                            )}`}
                          />
                        ) : (
                          <PersonCircle
                            size={sizeIco}
                            className={`${styles.ico}`}
                          />
                        )}
                      </Col>
                      <Col className={`p-2`}>
                        <Card.Text>
                          {t("common:contact")}: {professional.contact}
                        </Card.Text>
                        {professional.company && (
                          <Card.Text>
                            {t("common:company")}: {professional.company.name}
                          </Card.Text>
                        )}
                        <Card.Text>
                          {t("common:email")}: {professional.email}
                        </Card.Text>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </InfiniteScroll>
        </Row>
      </section>
    </Layout>
  );
};

export async function getServerSideProps({ params, req, res, locale }) {
  // Get the user's session based on the request
  const session = await getSession({ req });

  let professionals = [];
  let { page, size } = req.__NEXT_INIT_QUERY;

  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }

  professionals = await professionalService.findAll(page, size);

  return {
    props: {
      data: professionals,
    },
  };
}
export default Professional;
