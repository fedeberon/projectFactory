// frameworks
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/client";
import { Container } from "reactstrap";

// components
import Header from "../../components/Header";
import FormProject from "../../components/FormProject";

// services
import { addProject, getProjects } from "../_clientServices";

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
      <h1>Project</h1>
      <FormProject onAddProject={onAddProject} />

      {isLoading ? (
        <h1>Loading...</h1>
      ) : !data ? (
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
