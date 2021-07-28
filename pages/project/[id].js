import React, { useState, useEffect } from "react";
import useTranslation from "next-translate/useTranslation";
import { getSession, useSession } from "next-auth/client";
import SeeProject from "../../components/SeeProject/SeeProject";
import * as projectService from "../../services/projectService";
import * as imageService from "../../services/imageService";
import Layout from "../../components/Layout/Layout";
import * as mercadopagoService from "../../services/mercadopagoService";

const ProjectDetail = ({ data, idSplit, status }) => {
  const [session, loading] = useSession();

  const [project, setProject] = useState({});

  const { t } = useTranslation("common");

  const editProject = async (project) => {
    const newProject = await projectService.edit(project, session.accessToken);
    setProject(newProject);
  };

  useEffect(() => {
    if (data) {
      setProject(data);
    }
  }, [session]);

  const onBuyProyect = async () => {
    const mp = new MercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY, {
      locale: "es-AR",
    });

    const preference = await mercadopagoService.createPreferenceToProject(
      idSplit,
      session.accessToken
    );
    mp.checkout({
      preference: preference.id,
    });

    const link = document.createElement("a");
    document.body.appendChild(link);
    link.href = preference.initPoint;
    link.setAttribute("type", "hidden");
    link.click();
  };

  const downloadProject = async () => projectService.download(idSplit, session.accessToken);

  return (
    <Layout>
      <section className="container py-2">
        <SeeProject
          project={project}
          status={status}
          onBuyProyect={onBuyProyect}
          downloadProject={downloadProject}
          onEditProject={editProject}
          id={idSplit}
        />
      </section>
    </Layout>
  );
};

export async function getServerSideProps({ params, req, query, res, locale }) {
  // Get the user's session based on the request
  const session = await getSession({ req });
  const token = session.accessToken;
  let { page, size } = req.__NEXT_INIT_QUERY;
  let { id } = params; // params is necessary in case you reload the page from the url
  const split = id.split("-");
  let idSplit = split[split.length - 1];
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
  project.projectsOfProfessional = projectsOfProfessional.filter(
    (p) => p.id != project.id
  );
  return {
    props: {
      data: project,
      idSplit,
      status: query.status ? query.status : "",
    },
  };
}

export default ProjectDetail;
