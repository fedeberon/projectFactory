import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
import { useSession } from "next-auth/client";
import { Container } from "reactstrap";
import SeeProject from "../../components/SeeProject";
import { getById } from '../../services/projectService';

const ProjectDetail = () => {
  const { t, lang } = useTranslation("common");
  const [session, loading] = useSession();
  const router = useRouter();
  const { id } = router.query;

  async function getProject(id) {
    return await getById(id,session.accessToken);
  }

  return (
    <Container fluid>
      <Header lang={lang} />
      <SeeProject getProject={getProject}/>
    </Container>
  );
};

export default ProjectDetail;
