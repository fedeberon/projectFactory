import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
import { Container } from "reactstrap";
import FormProfessional from "../../components/FormProfessional";
import { getSession, useSession } from "next-auth/client";
import { getProfessionals, addProfessional } from "../_clientServices";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { findAll } from "../../services/professionalService";

const Professional = ({ professionals }) => {
  const [session] = useSession();
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(false);

  const { t, lang } = useTranslation("common");

  const updateProfessionalList = async () => {
    setLoading(true);
    // const professionals = await getProfessionals();
    if (professionals) {
      setData(professionals);
    }
    setLoading(false);
  };

  const onAddProfessional = async (data) => {
    setLoading(true);
    await addProfessional(data, session);
    await updateProfessionalList();
  };

  useEffect(async () => {
    await updateProfessionalList();
  }, [session]);

  return (
    <Container fluid>
      <Header lang={lang} />
      <h1>{t("Professional")}</h1>
      <FormProfessional onAddProfessional={onAddProfessional} />

      {isLoading ? (
        <h1>{t("Loading")}...</h1>
      ) : !data ? (
        <h1>{data}</h1>
      ) : (
        data.map((project) => (
          <div key={project.id}>
            <p>
              {t("Name")}: {project.firstName}
            </p>
            <p>
              {t("Description")}: {project.lastName}
            </p>
            <p>
              {t("Email")}: {project.email}
            </p>
          </div>
        ))
      )}
    </Container>
  );
};

export async function getServerSideProps({ params, req, res, locale }) {
  // Get the user's session based on the request
  const session = await getSession({ req });

  let token = session.accessToken;
  let professionals;
  let { page, size } = req.__NEXT_INIT_QUERY;

  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }

  if (session) {
    token = session.accessToken;
    professionals = await findAll(page, size, token);
    console.log("FindAll: ", professionals);
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      professionals,
    },
  };
}

export default Professional;
