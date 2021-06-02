import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";
import { getSession, useSession } from "next-auth/client";
import { Container } from "reactstrap";
import SeeProject from "../../components/SeeProject";
import * as projectService from "../../services/projectService";
import * as imageService from "../../services/imageService";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const ProjectDetail = ({ data }) => {
  const [session, loading] = useSession();

  const [project, setProject] = useState({});

  const { t, lang } = useTranslation("common");

  const editProject = async (project) => {
    const newProject = await projectService.edit(project, session.accessToken);
    setProject(newProject);
  };

  useEffect(() => {
    if (data) {
      setProject(data);
    }
  }, [session]);

  return (
    <Container fluid>
      <Header lang={lang} />
      <SeeProject project={project} onEditProject={editProject} />
    </Container>
  );
};

export async function getServerSideProps({ params, req, res, locale }) {
  // Get the user's session based on the request
  const session = await getSession({ req });

  let token;
  let project = {};
  let { page, size } = req.__NEXT_INIT_QUERY;
  let { id } = params; // params is necessary in case you reload the page from the url
  let idSplit = id.split("ID-")[1];

  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }

  if (session) {
    token = session.accessToken;
    project = await projectService.getById(idSplit, token);
    const dataImages = await imageService.getImages(
      project.id,
      token,
      page,
      size
    );
    project.images = dataImages;
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      data: project,
    },
  };
}

export default ProjectDetail;
