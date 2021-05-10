import React from "react";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
import { getSession } from "next-auth/client";
import { getAll } from "../../services/projectService";

const Proyect = ({ data }) => {
  const { t, lang } = useTranslation("common");
  return (
    <div>
      <Header lang={lang} />
      <h1>Proyect</h1>
      {data.map((project) => (
        <div key={project.id}>
          <p>Name: {project.name}</p>
          <p>Description: {project.description}</p>
          <p>Total Area: {project.totalArea}</p>
          <p>Year: {project.year}</p>
          <p>WebSite: {project.website}</p>
        </div>
      ))}
    </div>
  );
};

// This gets called on every request
export async function getServerSideProps({ params, req, res }) {
  // Fetch data from external API
  const session = await getSession({ req });

  const data = await getAll(0, 10, session);
  console.log(data);
  // Pass data to the page via props
  return { props: { data } };
}

export default Proyect;
