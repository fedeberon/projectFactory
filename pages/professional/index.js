// Frameworks
import React from "react";
import { getSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";

// Components
import Layout from "../../components/Layout/Layout";
// import SpinnerCustom from "../../components/SpinnerCustom/SpinnerCustom";
import ProfesionalList from "../../components/Professional/ProfesionalList/ProfesionalList";

// Services
import * as professionalService from "../../services/professionalService";

// Styles
import styles from "./index.module.css";

const Professional = ({ data, filterCategories }) => {
  const { t } = useTranslation("professional");

  return (
    <Layout>
      <section className="container content">
        <ProfesionalList data={data} filterCategories={filterCategories} />
      </section>
    </Layout>
  );
};

export async function getServerSideProps({ params, req, res, locale }) {
  // Get the user's session based on the request
  const session = await getSession({ req });

  // let professionals = { professionals: [], count: 0 };
  let professionals = { professionals: [], count: 0 };
  let professionalsFilter = [];
  let { page, size, categories } = req.__NEXT_INIT_QUERY;

  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }
  const arrayCategories = [];
  let categoryReplace;
  const status = "APPROVED";
  if (categories != undefined) {
    categoryReplace = categories.replace(/-/g, " ");
    arrayCategories.push(categoryReplace);
    professionals = await professionalService.getAllByCategoryAndStatus(
      status,
      arrayCategories,
      page,
      size
    );
  } else {
    const newProfessionals = await professionalService.findAll(page, size);
    professionals.professionals = newProfessionals.professionals;
    professionals.count = newProfessionals.count;
  }

  return {
    props: {
      data: professionals,
      filterCategories: arrayCategories,
    },
  };
}
export default Professional;
