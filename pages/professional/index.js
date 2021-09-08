// Frameworks
import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";
import { Card, Col, Row } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";

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
import AlertCustom from "../../components/Alert/AlertCustom";

const Professional = ({ data, filterCategories }) => {
  const { width, height } = useSize();
  const [sizeIco, setSizeIco] = useState(176);
  const [pageSize, setPageSize] = useState({
    page: 0,
    // size: process.env.NEXT_PUBLIC_SIZE_PER_PAGE,
    size: 10,
  });
  const [hasMore, setHasMore] = useState(true);
  const [localProfessionals, setlocalProfessionals] = useState(data);
  const [countFirst, setCountFirst] = useState(false);

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

  const onGetAllByCategoryAndStatus = async (status) => {
    // setLoading(true);
    try {
      const professionalsFilter =
        await professionalService.getAllByCategoryAndStatus(
          status,
          filterCategories,
          pageSize.page,
          pageSize.size
        );
      // setLoading(false);
      return professionalsFilter;
    } catch (error) {
      console.error(error);
      // setLoading(false);
    }
  };

  useEffect(async () => {
    // const newProfesionals = await onFindAll();
    // if (newProfesionals) {
    //   setProfessionals([...professionals, ...newProfesionals]);
    // }
    // if (countFirst) {
    const status = "APPROVED";
    const newProfessionals = await onGetAllByCategoryAndStatus(status);
    // console.log("pageSize_professionals", newProfessionals);
    if (newProfessionals) {
      // setlocalProfessionals({
      //   ...localProfessionals,
      //   professionals: [
      //     ...localProfessionals.professionals,
      //     ...newProfessionals.professionals,
      //   ],
      //   count: newProfessionals.count,
      // });
      // console.log("dentro del if", newProfessionals);
      // } else {
      //   setCountFirst(true);
      //   console.log("cambia", countFirst);
      // }
    }
  }, [pageSize]);

  useEffect(async () => {
    // console.log("localProfessionals", localProfessionals);
    if (localProfessionals.professionals.length > 0) {
      // const total = await getTotalProfessionals();
      if (localProfessionals.professionals.length == localProfessionals.count) {
        // console.log("lo que tengo", localProfessionals.professionals.length);
        // console.log("lo que viene como maximo", localProfessionals.count);
        // console.log("maximo");
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    }
  }, [localProfessionals]);

  useEffect(async () => {
    // dispatch(professionalActions.store(data));
    setlocalProfessionals(data);
  }, [data]);

  return (
    <Layout title={`${t("common:professional")}`}>
      <section className="container py-2">
        <Row className="w-100 m-0">
          <InfiniteScroll
            className="row row-cols-1 row-cols-lg-2 row-cols-xl-3 g-4 "
            dataLength={localProfessionals.professionals.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<SpinnerCustom className="w-100 m-0 my-2" />}
            endMessage={
              <Col xs={12}>
                <AlertCustom themeDark>
                  <InfoCircleFill size={25} />
                  {`${t("common:yay-You-have-seen-it-all")}`}
                </AlertCustom>
              </Col>
            }
          >
            {localProfessionals.professionals.map((professional, index) => (
              <Col key={index}>
                <Card className={`${styles.card}`}>
                  <Card.Body className={`p-0`}>
                    <Row className={`row-cols-1 w-100 m-0`}>
                      <Col xs={12} className={`p-0 text-center`}>
                        <Link
                          href={`/professional/[id]`}
                          as={`/professional/${professional?.contact.replace(
                            /\s+/g,
                            "-"
                          )}-${professional?.id}`}
                        >
                          <a>
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
                          </a>
                        </Link>
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

  let professionals = { professionals: [], count: 0 };
  let professionalsFilter = [];
  let { page, size, categories } = req.__NEXT_INIT_QUERY;

  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }
  const arrayCategories = [];
  let categoryReplace;
  const status = "APPROVED";
  if (categories != undefined) {
    categoryReplace = categories.replace(/-/g, " ");
    arrayCategories.push(categoryReplace);
    professionals = await professionalService.getAllByCategoryAndStatus(
      status,
      arrayCategories,
      page,
      10
    );
  } else {
    const newProfessionals = await professionalService.findAll(page, 10);
    professionals.professionals = newProfessionals;
    professionals.count = newProfessionals.length;
  }

  return {
    props: {
      data: professionals,
      filterCategories: arrayCategories,
    },
  };
}
export default Professional;
