import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/client";
import { Container } from "reactstrap";
import SeeProject from "../../components/SeeProject";
import * as projectService from '../../services/projectService';

const ProjectDetail = () => {
  const { t, lang } = useTranslation("common");
  const [session, loading] = useSession();
  const [project, setProject] = useState({});
  const [professional, setProfessional] = useState({});

  const router = useRouter();
  const { id } = router.query;

  async function getProject(id) {
    return await projectService.getById(id,session.accessToken);
  }

  const editProject = async (project) => {
    const newProject = await projectService.edit(project, session.accessToken);
    setProject(newProject);
  }

  useEffect(() => {
    if (id != undefined && session != undefined) {
      fetchData();
    }

  }, [router,session]);


  const fetchData = async () => {
    const project = await getProject(id);
    setProfessional(project.professional);
    setProject(project);
}

  return (
    <Container fluid>
      <Header lang={lang} />
      <SeeProject project={project} professional={professional} onEditProject={editProject}/>
    </Container>
  );
};

export default ProjectDetail;