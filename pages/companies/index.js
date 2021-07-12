import React, { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import Layout from "../../components/Layout/Layout";
import * as companyService from "../../services/companyService";
import Company from "../../components/Company/Company";

const Companies = (props) => {
    const { data } = props;
    const { t } = useTranslation("common");
    const [companies, setCompanies] = useState(data);

    return <Layout title={t("company")}>
        {companies.map(company => 
            <Company key={company.id} company={company} />
        )}
    </Layout>
};

export async function getServerSideProps({ params, req, res, locale }) {
    const companies = await companyService.findAllByStatus(0, 10, "APPROVED");

    return {
      props: {
        data : companies
      },
    };
}

export default Companies;