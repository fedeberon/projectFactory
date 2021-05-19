// frameworks
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/client";
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

// components
import Header from "../../components/Header";
import FormProject from "../../components/FormProject";

// services
import { addProject, getProjects } from "../_clientServices";
import ModalFormProject from "../../components/ModalFormProject";

const Project = () => {
  const [session, loading] = useSession();
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(false);

  const { t, lang } = useTranslation("common");

  const updateProjectList = async () => {
    setLoading(true);
    const projects = await getProjects();
    setData(projects);
    setLoading(false);
  };

  const onAddProject = async (data) => {
    setLoading(true);
    await addProject(data, session);
    await updateProjectList();
  };

  useEffect(async () => {
    await updateProjectList();
  }, [session]);

  return (
    <Container fluid>
      <Header lang={lang} />
      <h1>{t("Project")}</h1>
      <ModalFormProject onAddProject={onAddProject}  buttonLabel={"+"} className={"Button"} />

      <Row>
        {isLoading ? (
          <h1>{t("Loading")}...</h1>
        ) : !data ? (
          <h1>{data}</h1>
        ) : (
          data.map((project) => (
            <Col md="4">
              <div key={project.id}>
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
              </div>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default Project;
