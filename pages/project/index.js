// frameworks
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getSession, useSession } from "next-auth/client";
import {
  CardDeck,
  Container,
  Col,
  Row,
  Card,
  CardText,
  CardBody,
} from "reactstrap";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

// components
import Header from "../../components/Header";
import ModalFormProject from "../../components/ModalFormProject";

// services
import { addPreviewImage, addImages } from "../../services/projectService";
import { findAll, addProject } from "../../services/projectService";
import { projectActions } from "../../store";

const Project = ({ data }) => {
  const [session, loading] = useSession();
  const [isLoading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const projects = useSelector((state) => Object.values(state.projects.items));

  const { t, lang } = useTranslation("common");

  const onAddProject = async (data, id) => {
    setLoading(true);
    const previewImage = data.previewImage;
    let images;
    if (data.images) {
      images = Array.from(data.images);
    }
    const project = await addProject(data, session?.accessToken, id);
    if (project) {
      dispatch(projectActions.addItem(project));
      if (previewImage) {
        await addPreviewImage(previewImage, project?.id, session?.accessToken);
      }
      if (images) {
        await addImages(images, project?.id, session?.accessToken);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    dispatch(projectActions.store(data));
  }, [data]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Container fluid>
      <Header lang={lang} />
      <h1>{t("Project")}</h1>
      <ModalFormProject
        onAddProject={onAddProject}
        buttonLabel={"+"}
        className={"Button"}
      />

      <Row>
        {isLoading ? (
          <h1>{t("Loading")}...</h1>
        ) : !projects ? (
          <h1>{projects}</h1>
        ) : (
          projects.map((project, index) => (
            <Col md="4" key={index}>
              <CardDeck>
                <Card>
                  <CardBody>
                    <CardText>
                      {t("Name")}: {project.name}
                    </CardText>
                    <CardText>
                      {t("Description")}: {project.description}
                    </CardText>
                    <CardText>
                      {t("Total Area")}: {project.totalArea}
                    </CardText>
                    <CardText>
                      {t("Year")}: {project.year}
                    </CardText>
                    <CardText>
                      {t("WebSite")}: {project.website}
                    </CardText>
                  </CardBody>
                </Card>
              </CardDeck>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export async function getServerSideProps({ params, req, res, locale }) {
  // Get the user's session based on the request
  const session = await getSession({ req });

  let token;
  let projects = [];
  let { page, size } = req.__NEXT_INIT_QUERY;

  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }

  if (session) {
    token = session.accessToken;
    projects = await findAll(page, size, token);
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      data: projects,
    },
  };
}

export default Project;
