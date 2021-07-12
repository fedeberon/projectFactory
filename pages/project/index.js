// frameworks
import React, { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { getSession, useSession } from "next-auth/client";
import {
  CardDeck,
  Button,
  Col,
  Row,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardFooter,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

// styles
import indexStyles from "./index.module.css";

// components
import ModalForm from "../../components/ModalForm";
import FormProject from "../../components/FormProject";
import Layout from "../../components/Layout/Layout";

// services
import * as professionalService from "../../services/professionalService";
import * as tagService from "../../services/tagService";
import * as projectService from "../../services/projectService";
import { projectActions } from "../../store";
import Link from "next/link";

const Project = ({ data, professionals, filters }) => {
  const [session, loading] = useSession();
  const [isLoading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const projects = useSelector((state) => Object.values(state.projects.items));
  const [filteredImages, setFilteredImages] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [showProjects, setShowProjects] = useState(true);

  const { t } = useTranslation("common");

  const onAddProject = async (data, id) => {
    setLoading(true);
    const project = await projectService.addProject(
      data,
      id,
      session.accessToken
    );
    dispatch(projectActions.addItem(project));
    setLoading(false);
  };

  const toggleModal = () => setModalOpen(!modalOpen);

  useEffect(() => {
    dispatch(projectActions.store(data));
  }, [data]);

  useEffect(() => {
    //dispatch(projectActions.store(data));
  }, [filteredImages]);

  useEffect(() => {
    if (appliedFilters.length > 0) {
      setShowProjects(false);
    } else {
      setShowProjects(true);
    }
  }, [appliedFilters]);

  const handleClickFilter = (filter) => {
    if (appliedFilters.contains(filter)) {
      removeFilter(filter);
    } else {
      addFilter(filter);
    }
  };

  const removeFilter = (filter) => {
    const newAppliedFilters = Array.from(appliedFilters);
    const index = newAppliedFilters.indexOf(filter);
    if (index > -1) {
      newAppliedFilters.splice(index, 1);
      setAppliedFilters(newAppliedFilters);
    }
  };

  const addFilter = (filter) => {
    const newAppliedFilters = Array.from(appliedFilters);
    newAppliedFilters.push(filter);
    setAppliedFilters(newAppliedFilters);
  };

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Layout title={t("project")}>
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
        size={"xl"}
        className={"Button"}
        modalTitle={t("form-project")}
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
          <h1>{t("loading")}...</h1>
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
                      {t("name")}: {project.name}
                    </CardText>
                    <CardText>
                      {t("description")}: {project.description}
                    </CardText>
                    <CardText>
                      {t("total-area")}: {project.totalArea}
                    </CardText>
                    <CardText>
                      {t("year")}: {project.year}
                    </CardText>
                    <CardText>
                      {t("web-site")}: {project.website}
                    </CardText>
                  </CardBody>
                  <CardFooter className="d-flex justify-content-end">
                    <Link
                      href={`/project/[id]`}
                      as={`/project/${project.name.replace(/\s+/g, "-")}-${
                        project.id
                      }`}
                      passHref
                    >
                      <Button color={"primary"}>{t("view-more")}</Button>
                    </Link>
                  </CardFooter>
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
  let response = [];
  let projects = [];
  let filters = [];
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
    filters = await tagService.findAll(token);
  }

  return {
    props: {
      data: projects,
      professionals: response,
      filters: filters,
    },
  };
}

export default Project;
