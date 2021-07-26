import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import Layout from "../../components/Layout/Layout";
import CarouselProject from "../../components/CarouselProject/CarouselProject";
import { getSession } from "next-auth/client";
import * as imageService from "../../services/imageService";
import * as buildingWorkService from "../../services/buildingWorkService";
import Link from "next/link";
import { Row, Col, Button, Card } from "react-bootstrap";
import buildingStyles from "./building.module.css";

const BuildingDetail = ({ data, session, imageClicked }) => {
  const [pageSize, setPageSize] = useState({ page: 0, size: 10 });
  const [filteredImages, setFilteredImages] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [currentImageId, setCurrentImageId] = useState(null);

  const [tagsAuxiliar, setTagsAuxiliar] = useState([]);
  const { t } = useTranslation("common");

  const [imagenes, setImagenes] = useState([]);

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
    try {
      return await imageService.getProfessionalImagesByTags(
        appliedFilters,
        pageSize.page,
        pageSize.size,
        session?.accessToken
      );
    } catch (error) {
      console.error(error);
    }
  };

  const onLoadImage = async () => {
    const newArray = [];
    await Promise.all(
      data.images.map(async (image) => {
        const imageInBytes = await fetch(image.path, {
          headers: { Authorization: session.accessToken },
        });
        const imageInBlob = await imageInBytes.blob();
        const imageSrc = URL.createObjectURL(imageInBlob);
        image.path = imageSrc;
        image.seen = false;
        newArray.push(image);
      })
    );
    return newArray;
  };

  useEffect(async () => {
    if (data.images && session) {
      let newArray = await onLoadImage();
      newArray = orderImagesByImageClicked(newArray);
      const firstImage = newArray[0];
      setCurrentImageId(firstImage.id);
      imageService.increaseVisit(firstImage);
      setImagenes(newArray);
      setAppliedFilters(firstImage.tags);
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
      <Row className="row-cols-1 g-2">
        <Col>
          <CarouselProject
            setAppliedFilters={setAppliedFilters}
            setCurrentImageId={setCurrentImageId}
            images={imagenes}
          />
        </Col>
      </Row>
      <section className="container py-2">
        <Row>
          <Col>
            <Row className="row-cols-md-2 g-4">
              <Col className="col-md-2 col-12">
                <Card body variant="outline-secondary">
                  <Card.Title tag="h5">
                    {data.buildingWork.professional?.company.name}
                  </Card.Title>
                  <Card.Text>
                    {data.buildingWork.professional?.province}
                  </Card.Text>
                  <Card.Text>
                    {data.buildingWork.professional?.location}
                  </Card.Text>
                  <Button>Ver Perfil</Button>
                </Card>
              </Col>
              <Col className="col-md-10 col-12">
                <Card className="border-0">
                  <Card.Title tag="h5">{data.buildingWork.name}</Card.Title>
                  <Card.Text>{data.buildingWork.description}</Card.Text>
                </Card>
              </Col>
            </Row>
            <Row className="row-cols-md-3">
              {filteredImages.map((image) => (
                <Col key={image.id} className="col-4">
                  <Card>
                    <Card.Body>
                      <Link
                        href={`/building/[id]`}
                        as={`/building/${image.buildingWork?.name?.replace(
                          /\s+/g,
                          "-"
                        )}-${image.buildingWork.id}-${image.id}`}
                        passHref
                      >
                        <Card.Img
                          src={image.path}
                          className={`${buildingStyles.imgCard}`}
                        />
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </section>
    </Layout>
  );
};

export async function getServerSideProps({ params, req, res, locale, query }) {
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
  let imageClicked = img;

  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }

  if (session) {
    token = session.accessToken;
    images = await imageService.getImagesByBuildingWorksId(
      buildingWorkId,
      page,
      size,
      token
    );
    if (!imageClicked) {
      imageClicked = images[0].id;
    }
    buildingWork = await buildingWorkService.getById(buildingWorkId, token);
  }

  return {
    props: {
      data: { images, buildingWork },
      session,
      imageClicked,
    },
  };
}

export default BuildingDetail;
