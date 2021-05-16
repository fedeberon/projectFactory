import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
import { Container } from "reactstrap";
import FormProfessional from "../../components/FormProfessional";
import { useSession } from "next-auth/client";
import { getProfessionals, addProfessional } from "../_clientServices";

const Professional = () => {
  const [session] = useSession();
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(false);

  const { t, lang } = useTranslation("common"); 

  const updateProfessionalList = async () => {
    setLoading(true);
    const professionals = await getProfessionals();
    setData(professionals);
    setLoading(false);
  };

  const onAddProfessional = async (data) => {
    setLoading(true);
    await addProfessional(data, session);
    await updateProfessionalList();
  }

  useEffect(async () => {
    await updateProfessionalList();
  }, [session]);

  return (
    <Container fluid>
      <Header lang={lang} />
      <h1>Professional</h1>
      <FormProfessional
        onAddProfessional={onAddProfessional}
      />

      {isLoading ? (
        <h1>Loading...</h1>
      ) : !data ? (
        <h1>{data}</h1>
      ) : (
        data.map((project) => (
          <div key={project.id}>
            <p>Name: {project.firstName}</p>
            <p>Description: {project.lastName}</p>
            <p>Total Area: {project.email}</p>
          </div>
        ))
      )}
    </Container>
  );
};

export default Professional;
