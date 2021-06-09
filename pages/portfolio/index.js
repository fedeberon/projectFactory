import React, { useEffect, useState } from "react";
import { professionalActions } from "../../store";
import { getSession, useSession } from "next-auth/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
import {
  Card,
  CardBody,
  CardDeck,
  CardImg,
  CardText,
  Col,
  Row,
} from "reactstrap";

// Services
import * as professionalService from "../../services/professionalService";

// Styles
import indexStyles from "./index.module.css";
import { Container } from "next/app";

const Portfolio = ({ professionalId, page, size }) => {
  const [session] = useSession();
  const { t, lang } = useTranslation("common");
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
    <Container fluid>
      <Header lang={lang} />
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
            <h1>{`${professional.firstName} ${professional.lastName}`}</h1>
          </div>
          <Row className="row-cols-1 row-cols-lg-2 row-cols-xl-3 g-4">
            {images}
          </Row>
        </div>
    </Container>
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
      ...(await serverSideTranslations(locale, ["common"])),
      professionalId,
      page,
      size,
    },
  };
}

export default Portfolio;
