import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getSession, useSession } from "next-auth/client";
import SeeProject from "../../components/SeeProject";
import * as projectService from "../../services/projectService";
import * as imageService from "../../services/imageService";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "../../components/Layout/Layout";

const ProjectDetail = ({ data, idSplit }) => {
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
    <Layout title={`${t("ProjectDetail")}`}>
      <SeeProject project={project} onEditProject={editProject} id={idSplit} />
    </Layout>
  );
};

export async function getServerSideProps({ params, req, res, locale }) {
  // Get the user's session based on the request
  const session = await getSession({ req });
  const token = session.accessToken;
  let { page, size } = req.__NEXT_INIT_QUERY;
  let { id } = params; // params is necessary in case you reload the page from the url
  const split = id.split("-");
  let idSplit = split[split.length -1];
  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }

  const project = await projectService.getById(idSplit, token);
  const dataImages = await imageService.getProjectImages(
    project.id,
    token,
    page,
    size
  );
  const projectsOfProfessional = await projectService.findAllByProfessionalId(
    project.professional.id,
    page,
    size,
    token
  );
  project.images = dataImages;
  project.projectsOfProfessional = projectsOfProfessional.filter(p => p.id != project.id);
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      data: project,
      idSplit
    },
  };
}

export default ProjectDetail;
