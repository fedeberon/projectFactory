// frameworks
import React, { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { getSession, useSession } from "next-auth/client";
import { Button, Col, Row, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

// styles
import indexStyles from "./index.module.css";

// components
import ModalForm from "../../components/ModalForm";
import FormProject from "../../components/FormProject";
import Layout from "../../components/Layout/Layout";
import SpinnerCustom from "../../components/SpinnerCustom/SpinnerCustom";

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

  const onAddProject = async (data) => {
    setLoading(true);
    try {
      const project = await projectService.addProject(
        data,
        session.accessToken
      );
      dispatch(projectActions.addItem(project));

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
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

  const isRole = (role) => {
    if (session) {
      return session.authorities.includes(role);
    }
  };

  return (
    <Layout title={t("project")}>
      <section className="container py-2">
        {isRole("ROLE_PROFESSIONAL") && (
          <Button
            className="position-fixed bottom-0 end-0 me-3 mb-3 rounded-circle zIndex"
            variant="danger"
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
            <FormProject onAddProject={onAddProject} toggle={toggleModal} />
          }
          modalOpen={{ open: modalOpen, function: setModalOpen }}
        />

        <Row className="row-cols-md-3 g-4">
          {isLoading ? (
            <SpinnerCustom />
          ) : (
            projects.map((project) => (
              <Col key={project.id}>
                <Card>
                  <Card.Img
                    className="img-fluid"
                    src={project.previewImage}
                    alt="Card image cap"
                  />
                  <Card.Body>
                    <Card.Text>
                      {t("name")}: {project.name}
                    </Card.Text>
                    <Card.Text>
                      {t("description")}: {project.description}
                    </Card.Text>
                    <Card.Text>
                      {t("total-area")}: {project.totalArea}
                    </Card.Text>
                    <Card.Text>
                      {t("year")}: {project.year}
                    </Card.Text>
                    <Card.Text>
                      {t("web-site")}: {project.website}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="d-flex justify-content-end">
                    <Link
                      href={`/project/[id]`}
                      as={`/project/${project.name.replace(/\s+/g, "-").toLowerCase()}-${
                        project.id
                      }`}
                      passHref
                    >
                      <Button variant={"primary"}>{t("view-more")}</Button>
                    </Link>
                  </Card.Footer>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </section>
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
    try {
      token = session.accessToken;
      projects = await projectService.findAll(page, size, token);
      response = await professionalService.findAll(page, size, token);
      filters = await tagService.findAll(token);
    } catch (e) {
      return { redirect: {
        destination: "/logIn?expired",
        permanent: false,
      },
    }
    }
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
