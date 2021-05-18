// frameworks
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/client";
import { Container } from "reactstrap";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// components
import Header from "../../components/Header";
import FormProject from "../../components/FormProject";

// services
import { addProject, getProfessionals, getProjects } from "../_clientServices";

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

  const getAllProfessionals = async () => {
    const professionals = await getProfessionals();
    return professionals;
  }

  const onAddProject = async (data, id) => {
    setLoading(true);
    await addProject(data, id);
    await updateProjectList();
  };

  useEffect(async () => {
    await updateProjectList();
  }, [session]);

  return (
    <Container fluid>
      <Header lang={lang} />
      <h1>{t("Project")}</h1>
      <FormProject onAddProject={onAddProject} getAllProfessionals={getAllProfessionals} />

      {isLoading ? (
        <h1>{t("Loading")}...</h1>
      ) : !data ? (
        <h1>{data}</h1>
      ) : (
        data.map((project) => (
          <div key={project.id} >
            <p>{t("Name")}: {project.name}</p>
            <p>{t("Description")}: {project.description}</p>
            <p>{t("Total Area")}: {project.totalArea}</p>
            <p>{t("Year")}: {project.year}</p>
            <p>{t("WebSite")}: {project.website}</p>
          </div>
        ))
      )}
    </Container>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default Project;
