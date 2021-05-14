// frameworks
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/client";
import { Container } from "reactstrap";

// components
import Header from "../../components/Header";
import FormProject from "../../components/FormProject";

// services
import { getProjects } from "../_clientServices";

const Project = () => {
  const [session, loading] = useSession();
  const [data, setData] = useState();

  const { t, lang } = useTranslation("common");

  const updateProjectList = async () => {
    const projects = await getProjects();
    setData(projects);
  };

  useEffect(async () => {
    await updateProjectList();
  }, [session]);

  return (
    <Container fluid>
      <Header lang={lang} />
      <h1>Project</h1>
      <FormProject updateProjectList={updateProjectList} />

      {!data ? (
        <h1>{data}</h1>
      ) : (
        data.map((project) => (
          <div key={project.id}>
            <p>Name: {project.name}</p>
            <p>Description: {project.description}</p>
            <p>Total Area: {project.totalArea}</p>
            <p>Year: {project.year}</p>
            <p>WebSite: {project.website}</p>
          </div>
        ))
      )}
    </Container>
  );
};

export default Project;
