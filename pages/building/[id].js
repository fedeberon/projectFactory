// Frameworks
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { getSession } from "next-auth/client";
import { Row, Col, Card, Container } from "react-bootstrap";
import Link from "next/link";

// Services
import * as imageService from "../../services/imageService";
import * as buildingWorkService from "../../services/buildingWorkService";

// Components
import Layout from "../../components/Layout/Layout";
import SwiperCarouselProject from "../../components/Swiper/SwiperCarouselProject/SwiperCarouselProject";
import FilteredImages from "../../components/FilteredImages/FilteredImages";
import SpinnerCustom from "../../components/SpinnerCustom/SpinnerCustom";

// Styles
import styles from "./building.module.css";

const BuildingDetail = ({ data, session, imageClicked }) => {
  const [pageSize, setPageSize] = useState({ page: 0, size: 10 });
  const [filteredImages, setFilteredImages] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [currentImageId, setCurrentImageId] = useState(null);
  const [currentTag, setCurrentTag] = useState("");
  const [reset, setReset] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingSwiper, setLoadingSwiper] = useState(false);

  const [tagsAuxiliar, setTagsAuxiliar] = useState([]);
  const { t } = useTranslation("common");

  const [imagenes, setImagenes] = useState(data.images);

  const resetCarousel = () => setReset(!reset);

  const router = useRouter();
  const { id } = router.query;

  // Order the images putting on first place the image clicked by the user in home
  const orderImagesByImageClicked = (images) => {
    const [first] = images.filter((img) => img.id == imageClicked);
    return images.sort((x, y) => {
      return x == first ? -1 : y == first ? 1 : 0;
    });
  };

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

  useEffect(() => {
    const tag = getTagOfTheCurrentImage();
    setCurrentTag(tag);
  }, [currentImageId]);

  const getTagOfTheCurrentImage = () => {
    const [currentImage] = data.images.filter(
      (img) => img.id === currentImageId
    );
    if (currentImage) {
      return currentImage.tags[0].name;
    } else {
      return "";
    }
  };

  const onLoadImage = async () => {
    setLoadingSwiper(true);
    const newArray = [];
    await Promise.all(
      data.images.map(async (image) => {
        const imageInBytes = await fetch(image.path);
        const imageInBlob = await imageInBytes.blob();
        const imageSrc = URL.createObjectURL(imageInBlob);
        image.path = imageSrc;
        image.seen = false;
        newArray.push(image);
      })
    );
    setLoadingSwiper(false);
    return newArray;
  };

  useEffect(async () => {
    if (data.images && imageClicked) {
      let newArray = await onLoadImage();
      newArray = orderImagesByImageClicked(newArray);
      const firstImage = newArray[0];
      setCurrentImageId(firstImage.id);
      imageService.increaseVisit(firstImage);
      setImagenes(newArray);
      setAppliedFilters(firstImage.tags);
      setTagsAuxiliar(firstImage.tags);
    }
  }, [data.images]);

  useEffect(async () => {
    let images = await getProfessionalsByTags();
    if (images) {
      images = images.filter((img) => img.id != currentImageId);
      setFilteredImages(images);
    }
  }, [appliedFilters]);

  return (
    <Layout>
      <Container fluid className="p-0">
        {/* {isLoadingSwiper ? (
          <SpinnerCustom center />
        ) : ( */}
          <SwiperCarouselProject
            setAppliedFilters={setAppliedFilters}
            setCurrentImageId={setCurrentImageId}
            images={imagenes}
            reset={reset}
          />
        <Row>
          <Col>
            <div className={`${styles.contPhotoInfo}`}>
              <div className="container-fluid clearfix">
                <h1 className={`${styles.titName}`}>Foto: {currentTag}</h1>
                <h2 className={`${styles.titProjects}`}>
                  <a href="">Proyecto: {data.buildingWork.name}</a>
                </h2>
                <Link
                  href={`/professional/[id]`}
                  as={`/professional/${data.buildingWork.professional.contact.replace(
                    /\s+/g,
                    "-"
                  )}-${data.buildingWork.professional.id}`}
                >
                  {/* <a>{category.name}</a> */}
                  <a className={`${styles.verMas}`}>
                    {/* Mesopotamian BA. */}
                    {data.buildingWork.professional.contact}
                    {/* {data.buildingWork.professional.id} */}
                  </a>
                </Link>
              </div>
            </div>
          </Col>
        </Row>
        {/* )} */}
        <Row className="w-100 m-0 mt-4">
          <Col>
            <Container>
              {Object.keys(data.buildingWork).length > 0 && (
                <Row className="w-100 gap-2 gap-lg-0 m-0 my-4">
                  <Col className="col-12 col-md-12 col-lg-9 order-lg-2">
                    <Card className="border-0">
                      <Card.Title
                        tag="h5"
                        className={`${styles.titObraDetail}`}
                      >
                        {data.buildingWork.name}
                      </Card.Title>
                      <Card.Text>{data.buildingWork.description}</Card.Text>
                    </Card>
                  </Col>
                  <Col className="col-12 col-md-12 col-lg-3 order-lg-1">
                    <Col
                      className={`${styles.boxDeg} p-4 d-flex flex-column gap-2`}
                    >
                      <h3 className={`${styles.titName}`}>
                        {data.buildingWork.professional.contact}
                      </h3>
                      <h3 className={`${styles.titProjects}`}>
                        <span className="d-block">{t("email")}</span>
                        <span>{data.buildingWork.professional.email}</span>
                      </h3>
                    </Col>
                  </Col>
                </Row>
              )}
            </Container>
          </Col>
        </Row>
        <section className="container py-2">
          <Row>
            <Col>
              <div className={`${styles.related} row`}>
                <div className="col">
                  <h2 className={`${styles.tit}`}>
                    {t("other-building-works-of")}
                    {currentTag}
                  </h2>
                </div>
              </div>
              <Row className="row-cols-1 gap-2">
                <Col>
                  <FilteredImages
                    isLoading={isLoading}
                    images={filteredImages}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </section>
      </Container>
    </Layout>
  );
};

export async function getServerSideProps({ params, req, query }) {
  // Get the user's session based on the request
  const session = await getSession({ req });
  let token;
  let images = [];
  let buildingWork = {};
  let { page, size, img } = req.__NEXT_INIT_QUERY;
  let { id } = params; // params is necessary in case you reload the page from the url
  const split = id.split("-");
  // const imageClicked = split[split.length - 1]; // The image that the user do click in home
  const buildingWorkId = split[split.length - 1];
  let imageClicked = query.img;

  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }

  try {
    images = await imageService.getImagesByBuildingWorksId(
      buildingWorkId,
      0,
      99
    );
    if (imageClicked === undefined && images.length > 0) {
      imageClicked = images[0].id;
    } else {
      // TODO: item not approved, then send message the error this item not approved.
      // return {
      //   redirect: {
      //     destination: "/",
      //     permanent: false,
      //   },
      // };
    }
  } catch (error) {
    console.error(error);
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  try {
    buildingWork = await buildingWorkService.getById(buildingWorkId);
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      data: { images, buildingWork },
      session,
      imageClicked: imageClicked ? imageClicked : null,
    },
  };
}

export default BuildingDetail;
