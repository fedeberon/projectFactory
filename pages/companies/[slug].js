import React from "react";
import Layout from "../../components/Layout/Layout";
import useTranslation from "next-translate/useTranslation";
import * as companyService from "../../services/companyService";

const CompanyDetails = () => {
    const { t } = useTranslation("common");
    return <Layout title={t("companies")}><h1>company details works!!!</h1></Layout>
};

export async function getServerSideProps({ params, req, query, res, locale }) {
    //const company = await companyService.findById()

    return {
      props: {
        data: "",
      },
    };
}

export default CompanyDetails;