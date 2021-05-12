// frameworks
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/client";

// components
import Header from "../../components/Header";

// services
import { getProjects } from "../_clientServices";

const Project = () => {
  const [session, loading] = useSession();
  const [data, setData] = useState();

  const { t, lang } = useTranslation("common");

  useEffect(async () => {
    const projects = await getProjects();
    setData(projects);
  }, [session]);

  return (
    <div>
      <Header lang={lang} />
      <h1>Project</h1>

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
    </div>
  );
};

export default Project;
