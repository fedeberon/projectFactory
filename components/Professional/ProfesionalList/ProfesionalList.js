import React, { useState, useEffect } from "react";
import useTranslation from "next-translate/useTranslation";
import { Col, Row } from "react-bootstrap";
import ContentHeader from "../../ContentHeader/ContentHeader";
import SpinnerCustom from "../../SpinnerCustom/SpinnerCustom";
import Professional from "../Professional/Professional";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import AlertCustom from "../../Alert/AlertCustom";
import { InfoCircleFill } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";

// Services
import * as professionalService from "../../../services/professionalService";
import Sidebar from "../../Sidebar/Sidebar";
import Link from "next/link";

const ProfesionalList = (props) => {
  const { data, filterCategories } = props;
  const { t } = useTranslation("common");
  const [localProfessionals, setLocalProfessionals] = useState(data);
  // console.log(localProfessionals);
  const [isLoading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState({
    page: 0,
    // size: process.env.NEXT_PUBLIC_SIZE_PER_PAGE,
    size: 10,
  });
  const [hasMore, setHasMore] = useState(true);

  const [countFirst, setCountFirst] = useState(false);
  const categoriesProfessionals = useSelector(
    (state) => state.categories.professionals
  );

  const changePage = () => {
    const { page } = { page: pageSize.page + 1 };
    setPageSize({ ...pageSize, page });
  };

  const fetchMoreData = () => {
    setTimeout(() => {
      changePage();
    }, 1500);
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
    // console.log("newProfessionals", newProfessionals);
    // console.log("pageSize_professionals", newProfessionals);
    if (newProfessionals) {
      // setLocalProfessionals({
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
    setLocalProfessionals(data);
  }, [data]);

  const selectTitle = () => {
    return filterCategories.length === 0
      ? t("professional:all")
      : filterCategories[0];
  };
  return (
    <div>
      <Row>
        {/* <Col sm={12} md={4} lg={3}> */}
        <Sidebar>
          <h3>{t("professionals")}</h3>
          <ul>
            <li>
              <Link href="/professional" passHref>
                <a>{t("professional:all")}</a>
              </Link>
            </li>
            {categoriesProfessionals.map((category, index) => (
              <li key={index}>
                <Link
                  href={`/professional?categories=${category.name.replace(
                    /\s+/g,
                    "-"
                  )}`}
                >
                  <a>{category.name}</a>
                </Link>
              </li>
            ))}
          </ul>
        </Sidebar>
        {/* </Col> */}
        <Col sm={12} md={8} lg={9}>
          <ContentHeader title={selectTitle()} />

          <Row className="row-cols-1 gap-2">
            {/* <Col>
                <FormFilterCompany
                  onGetFilterCompanies={onGetFilterCompanies}
                  setCompanies={setCompanies}
                />
              </Col> */}
            <Col>
              <Row className="w-100 m-0">
                <InfiniteScroll
                  className="row row-cols-1"
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
                  {localProfessionals.professionals.map(
                    (professional, index) => {
                      return (
                        <Col key={index}>
                          <Professional
                            professional={professional}
                          ></Professional>
                        </Col>
                      );
                    }
                  )}
                </InfiniteScroll>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default ProfesionalList;
