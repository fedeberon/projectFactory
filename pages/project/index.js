// frameworks
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getSession, useSession } from "next-auth/client";
import {
  CardDeck,
  Container,
  Button,
  Col,
  Row,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardFooter,
} from "reactstrap";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

// components
import Header from "../../components/Header";
import ModalForm from "../../components/ModalForm";
import FormProject from "../../components/FormProject";

// services
import {
  addPreviewImage,
  addImages,
  addFile,
} from "../../services/projectService";
import * as professionalService from "../../services/professionalService";
import * as projectService from "../../services/projectService";
import { projectActions } from "../../store";
import Link from "next/link";

const Project = ({ data, professionals }) => {
  const [session, loading] = useSession();
  const [isLoading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const projects = useSelector((state) => Object.values(state.projects.items));

  const { t, lang } = useTranslation("common");

  const onAddProject = async (data, id) => {
    setLoading(true);
    const project = await projectService.addProject(data, id, session.accessToken);
    dispatch(projectActions.addItem(project));
    setLoading(false);
  };

  const toggleModal = () => setModalOpen(!modalOpen);

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
      {session && (
        <Button
          className="position-fixed bottom-0 end-0 me-3 mb-3 rounded-circle zIndex"
          color="danger"
          onClick={toggleModal}
        >
          +
        </Button>
      )}
      <ModalForm
        className={"Button"}
        modalTitle={t("FORM PROJECT")}
        formBody={
          <FormProject
            onAddProject={onAddProject}
            professionals={professionals}
            toggle={toggleModal}
          />
        }
        modalOpen={{ open: modalOpen, function: setModalOpen }}
      />

      <Row className="row-cols-md-3 g-4">
        {isLoading ? (
          <h1>{t("Loading")}...</h1>
        ) : (
          projects.map((project) => (
            <Col key={project.id}>
              <CardDeck>
                <Card>
                  <CardImg
                    top
                    className="img-fluid"
                    src={project.previewImage}
                    alt="Card image cap"
                  />
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
                  <CardFooter className="d-flex justify-content-end">
                    <Link
                      href={`/project/[id]`}
                      as={`/project/${project.name}-ID-${project.id}`}
                      passHref
                    >
                      <Button color={"primary"}>{t("Ver más")}</Button>
                    </Link>
                  </CardFooter>
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
  let response = [];
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
    projects = await projectService.findAll(page, size, token);
    response = await professionalService.findAll(page, size, token);
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      data: projects,
      professionals: response,
    },
  };
}

export default Project;
