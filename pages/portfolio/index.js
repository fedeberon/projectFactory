import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";
import Layout from "../../components/Layout/Layout";
import {
  Card,
  CardDeck,
  CardImg,
  Col,
  Row,
} from "reactstrap";

// Services
import * as professionalService from "../../services/professionalService";

// Styles
import indexStyles from "./index.module.css";

const Portfolio = ({ professionalId, page, size }) => {
  const [session] = useSession();
  const { t } = useTranslation("common");
  const [professional, setProfessional] = useState({});

  useEffect(async () => {
    if (session != undefined) {
      const data = await professionalService.getByIdWithImages(
        professionalId,
        page,
        size,
        session.accessToken
      );
      setProfessional(data);
    }
  }, [session]);

  const images = professional.images?.map((image, index) => (
    <Col key={index}>
      <CardDeck>
        <Card>
          <CardImg
            className="img-fluid"
            top
            src={image.path}
            alt="Professional preview"
          />
        </Card>
      </CardDeck>
    </Col>
  ));

  return (
    <Layout>
      <img
        src={professional.backgroundImage}
        className={indexStyles.backgroundImg}
      ></img>
      <div className={indexStyles.previewDiv}>
        <img
          src={professional.previewImage}
          className={indexStyles.previewImg}
        ></img>
      </div>
      <div className={indexStyles.imagesDiv}>
        <div className="text-center">
          <h1>{`${professional.contact}`}</h1>
          <h1>{`${professional.company?.name}`}</h1>
        </div>
        <Row className="row-cols-1 row-cols-lg-2 row-cols-xl-3 g-4">
          {images}
        </Row>
      </div>
    </Layout>
  );
};

export async function getServerSideProps({ params, req, res, locale }) {
  // Get the user's session based on the request
  const session = await getSession({ req });

  let token;
  let professionalId;
  let { page, size } = req.__NEXT_INIT_QUERY;

  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }

  if (session) {
    token = session.accessToken;
    professionalId = session.user.id;
  }

  return {
    props: {
      professionalId,
      page,
      size,
    },
  };
}

export default Portfolio;
