// Frameworks
import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";
import {
  Button,
  Card,
  CardBody,
  CardDeck,
  CardImg,
  CardText,
  Col,
  Row,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";

// Components
import Layout from "../../components/Layout/Layout";

// Services
import * as professionalService from "../../services/professionalService";

// Store
import { professionalActions } from "../../store";

// Styles
import indexStyles from "./index.module.css";

const Professional = ({ data }) => {
  const [session] = useSession();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const professionals = useSelector((state) =>
    Object.values(state.professionals.items)
  );

  const { t } = useTranslation("professional");

  useEffect(() => {
    dispatch(professionalActions.store(data));
  }, [data]);

  const saveProfessional = async (data) => {
    try {
      const professional = await professionalService.addProfessional(
        data,
        session?.accessToken
      );
      return professional;
    } catch (error) {
      console.error(error);
      setError(`${t("email-is-already-exist-please-write-another-one")}`);
      return null;
    }
  };

  const savePreviewImage = async (professional, previewImage) => {
    try {
      await professionalService.addPreviewImage(
        previewImage,
        professional.id,
        session.accessToken
      );
      professional.previewImage = URL.createObjectURL(previewImage);
    } catch (error) {
      console.error(error);
    }
  };

  const saveImages = async (images, professional) => {
    try {
      await professionalService.addImages(
        images,
        professional.id,
        session.accessToken
      );
    } catch (error) {
      console.error(error);
    }
  };

  const saveBackgroundImage = async (professional, backgroundImage) => {
    try {
      await professionalService.addBackgroundImage(
        backgroundImage,
        professional.id,
        session.accessToken
      );
      professional.backgroundImage = URL.createObjectURL(backgroundImage);
    } catch (error) {
      console.error(error);
    }
  };

  const onAddProfessional = async (data) => {
    setLoading(true);
    const previewImage = data.previewImage;
    const backgroundImage = data.backgroundImage;
    const images = data.images;

    const professional = await saveProfessional(data);

    if (professional != null) {
      if (previewImage) {
        await savePreviewImage(professional, previewImage);
      }
      if (backgroundImage) {
        await saveBackgroundImage(professional, backgroundImage);
      }
      if (images.length > 0) {
        await saveImages(images, professional);
      }
      dispatch(professionalActions.addItem(professional));
    }
    setLoading(false);
    return professional;
  };

  return (
    <Layout title={`${t("common:professional")}`}>
      <Row className="row-cols-md-3 g-4">
        {isLoading ? (
          <h1>{t("Loading")}...</h1>
        ) : (
          professionals.map((professional, index) => (
            <Col key={index}>
              <CardDeck>
                <Card>
                  <CardImg
                    className="img-fluid"
                    top
                    src={professional.previewImage}
                    alt="Professional preview"
                  />
                  <CardBody>
                    <CardText>
                      {t("common:contact")}: {professional.contact}
                    </CardText>
                    <CardText>
                      {t("common:company")}: {professional.company.name}
                    </CardText>
                    <CardText>
                      {t("common:email")}: {professional.email}
                    </CardText>
                    <CardText>
                      {t("common:province")}: {professional.province}
                    </CardText>
                    <CardText>
                      {t("common:location")}: {professional.location}
                    </CardText>
                  </CardBody>
                </Card>
              </CardDeck>
            </Col>
          ))
        )}
      </Row>
    </Layout>
  );
};

export async function getServerSideProps({ params, req, res, locale }) {
  // Get the user's session based on the request
  const session = await getSession({ req });

  let token;
  let professionals = [];
  let { page, size } = req.__NEXT_INIT_QUERY;

  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }

  if (session) {
    token = session.accessToken;
    professionals = await professionalService.findAll(page, size, token);
  }

  return {
    props: {
      data: professionals,
    },
  };
}
export default Professional;
