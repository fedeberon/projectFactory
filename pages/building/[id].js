import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import Layout from "../../components/Layout/Layout";
import CarouselProject from "../../components/CarouselProject/CarouselProject";
import { getSession } from "next-auth/client";
import * as imageService from "../../services/imageService";
import * as buildingWorkService from "../../services/buildingWorkService";
import {
  Row,
  Col,
  Button,
  Card,
  CardTitle,
  CardText,
  CardGroup,
  CardImg,
  CardBody,
  CardSubtitle,
  CardDeck,
} from "reactstrap";
import buildingStyles from "./building.module.css";

const BuildingDetail = ({ data, session }) => {
  const [pageSize, setPageSize] = useState({ page: 0, size: 10 });
  const [filteredImages, setFilteredImages] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [currentImageId, setCurrentImageId] = useState(null);

  const [tagsAuxiliar, setTagsAuxiliar] = useState([]);
  const { t } = useTranslation("common");

  const [imagenes, setImagenes] = useState([]);

  const router = useRouter();
  const { id } = router.query;

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
      setImagenes(newArray);
      let copy = [];
      data.images.forEach((images) => {
        copy.push(Array.from(images.tags)[0]);
      });
      setAppliedFilters(copy);
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
    <Layout title={`${t("building-work-detail")}`}>
      <Row className="row-cols-1 g-2">
        <Col>
          <CarouselProject
            setAppliedFilters={setAppliedFilters}
            setCurrentImageId={setCurrentImageId}
            images={imagenes}
          />
        </Col>
        <Col>
          <Row className="row-cols-md-2 g-4">
            <Col className="col-md-2 col-12">
              <Card body outline color="secondary">
                <CardTitle tag="h5">
                  {data.buildingWork.professional?.company.name}
                </CardTitle>
                <CardText>{data.buildingWork.professional?.province}</CardText>
                <CardText>{data.buildingWork.professional?.location}</CardText>
                <Button>Ver Perfil</Button>
              </Card>
            </Col>
            <Col className="col-md-10 col-12">
              <Card className="border-0">
                <CardTitle tag="h5">{data.buildingWork.name}</CardTitle>
                <CardText>{data.buildingWork.description}</CardText>
              </Card>
            </Col>
          </Row>
          <Row className="row-cols-md-3">
            {filteredImages.map((image) => (
              <Col key={image.id} className="col-4">
                <CardDeck className="p-1">
                  <Card>
                    <CardBody>
                      <CardImg
                        src={image.path}
                        className={`${buildingStyles.imgCard}`}
                      />
                    </CardBody>
                  </Card>
                </CardDeck>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Layout>
  );
};

export async function getServerSideProps({ params, req, res, locale }) {
  // Get the user's session based on the request
  const session = await getSession({ req });
  let token;
  let images = [];
  let buildingWork = {};
  let { page, size } = req.__NEXT_INIT_QUERY;
  let { id } = params; // params is necessary in case you reload the page from the url
  const split = id.split("-");
  let idSplit = split[split.length - 1];
  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }

  if (session) {
    token = session.accessToken;
    images = await imageService.getImagesByBuildingWorksId(
      idSplit,
      page,
      size,
      token
    );
    buildingWork = await buildingWorkService.getById(idSplit, token);
  }

  return {
    props: {
      data: { images, buildingWork },
      session,
    },
  };
}

export default BuildingDetail;
