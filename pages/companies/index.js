import React, { useState } from "react";
import useTranslation from "next-translate/useTranslation";
import Layout from "../../components/Layout/Layout";
import * as companyService from "../../services/companyService";
import Company from "../../components/Company/Company";
import CardList from "../../components/CardList";
import { Col, Row } from "reactstrap";

import FormFilterCompany from "../../components/FormFilterCompany/FormFilterCompany";

const Companies = (props) => {
  const { data } = props;
  const { t } = useTranslation("common");
  const [companies, setCompanies] = useState(data);

  const onGetFilterCompanies = async (data, status, page, size) => {
    try {
      const companies = await companyService.findAllByFieldAndStatus(
        data,
        status,
        page,
        size
      );
      console.log(companies);
      return companies;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout title={t("companies")}>
          <FormFilterCompany
            onGetFilterCompanies={onGetFilterCompanies}
            setCompanies={setCompanies}
          />
      <Row>
        <Col>
        </Col>
        <Col className="col-10">
          <CardList companies={companies} />
        </Col>
      </Row>
    </Layout>
  );

  {
    /* return (
    <Layout title={t("company")}>
      <FormFilterCompany
        onGetFilterCompanies={onGetFilterCompanies}
        setCompanies={setCompanies}
      />

      {companies.map((company) => (
        <Company key={company.id} company={company} />
      ))}
    </Layout>
  ); */
  }
};

export async function getServerSideProps({ params, req, res, locale }) {
  let { page, size } = req.__NEXT_INIT_QUERY;

  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }
  const companies = await companyService.findAllByStatus(
    page,
    size,
    "APPROVED"
  );

  return {
    props: {
      data: companies,
    },
  };
}

export default Companies;
