import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/client";
import { Container } from "reactstrap";
import SeeProject from "../../components/SeeProject";
import * as projectService from '../../services/projectService';
import * as imageService from '../../services/imageService';

const ProjectDetail = () => {
  const { t, lang } = useTranslation("common");
  const [session, loading] = useSession();
  const [project, setProject] = useState({});
  const router = useRouter();
  const { id } = router.query;

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
    const data = await projectService.getById(id,session.accessToken);
    const dataImages = await imageService.getImages(data.id,session.accessToken,0,5);
    data.images = dataImages;
    setProject(data);
  }

  return (
    <Container fluid>
      <Header lang={lang} />
      <SeeProject project={project} onEditProject={editProject}/>
    </Container>
  );
};

export default ProjectDetail;