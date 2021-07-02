import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import Layout from "../../components/Layout/Layout";
import CarouselProject from "../../components/CarouselProject/CarouselProject";
import { getSession } from "next-auth/client";
import * as imageService from "../../services/imageService";
import * as buildingWorkService from "../../services/buildingWorkService";
import { Row, Col, Button, Card, CardTitle, CardText } from "reactstrap";

const BuildingDetail = ({ data, session }) => {
  const { t } = useTranslation("common");

  const [imagenes, setImagenes] = useState([]);

  const router = useRouter();
  const { id } = router.query;

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
        newArray.push(image);
      })
    );
    return newArray;
  };

  useEffect(async () => {
    if (data.images && session) {
      let newArray = await onLoadImage();
      setImagenes(newArray);
    }
  }, [data.images]);

  return (
    <Layout title={`${t("building-work-detail")}`}>
      <Row className="row-cols-1 g-2">
        <Col>
          <CarouselProject images={imagenes} />
        </Col>
        <Col>
          <Row className="row-cols-2 g-4">
            <Col className="col-2">
              <Card body outline color="secondary">
                <CardTitle tag="h5">
                  {data.buildingWork.professional.company.name}
                </CardTitle>
                <CardText>{data.buildingWork.professional.province}</CardText>
                <CardText>{data.buildingWork.professional.location}</CardText>
                <Button>Ver Perfil</Button>
              </Card>
            </Col>
            <Col className="col-10">
              <Card className="border-0">
                <CardTitle tag="h5">{data.buildingWork.name}</CardTitle>
                <CardText>{data.buildingWork.description}</CardText>
              </Card>
            </Col>
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
