import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
import { Container } from "reactstrap";
import FormProfessional from "../../components/FormProfessional";
import { getSession, useSession } from "next-auth/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { findAll, setProfessional } from "../../services/professionalService";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { professionalActions } from "../../store";

const Professional = ({ data }) => {
  const [session] = useSession();

  const [isLoading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const professionals = useSelector((state) =>
    Object.values(state.professionals.items)
  );

  const { t, lang } = useTranslation("common");

  useEffect(() => {
    dispatch(professionalActions.store(data));
  }, [data]);

  const onAddProfessional = async (data) => {
    setLoading(true);
    const professional = await setProfessional(data, session?.accessToken);
    if (professional) {
      console.log(professional);
      dispatch(professionalActions.addItem(professional));
      setLoading(false);
    }
  };

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Container fluid>
      <Header lang={lang} />
      <h1>{t("Professional")}</h1>
      <FormProfessional onAddProfessional={onAddProfessional} />

      {isLoading ? (
        <h1>{t("Loading")}...</h1>
      ) : !professionals ? (
        <h1>No se encontraron profesionales</h1>
      ) : (
        professionals.map((professional) => (
          <div key={professional.id}>
            <p>
              {t("Name")}: {professional.firstName}
            </p>
            <p>
              {t("Description")}: {professional.lastName}
            </p>
            <p>
              {t("Email")}: {professional.email}
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

  let token;
  let professionals = [];
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
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      data: professionals,
    },
  };
}

export default Professional;
