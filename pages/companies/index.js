import React, { useState } from "react";
import useTranslation from "next-translate/useTranslation";
import Layout from "../../components/Layout/Layout";
import * as companyService from "../../services/companyService";
import Company from "../../components/Company/Company";
import CardList from "../../components/CardList";
import { Col, Row } from "react-bootstrap";
import ContentHeader from "../../components/ContentHeader/ContentHeader";
import Link from "next/link";
import Sidebar from "../../components/Sidebar/Sidebar";
import FormFilterCompany from "../../components/FormFilterCompany/FormFilterCompany";
import SpinnerCustom from "../../components/SpinnerCustom/SpinnerCustom";

const Companies = (props) => {
  const { data } = props;
  const { t } = useTranslation("common");
  const [companies, setCompanies] = useState(data);
  const [isLoading, setLoading] = useState(false);

  const onGetFilterCompanies = async (data, status, page, size) => {
    setLoading(true);
    try {
      const companies = await companyService.findAllByFieldAndStatus(
        data,
        status,
        page,
        size
      );
      setLoading(false);
      return companies;
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="container content">
        <Row>
          {/* <Sidebar>
            <h3>{t("professionals")}</h3>
            <ul>
              <li>
                <Link href={`/professional`}>
                  <a>{t("professionals")}</a>
                </Link>
              </li>
              <li>
                <Link href={`/companies`}>
                  <a>{t("companies")}</a>
                </Link>
              </li>
            </ul>
          </Sidebar> */}
          <Col sm={12} md={4} lg={3}></Col>
          <Col sm={12} md={8} lg={9}>
            <ContentHeader title={t("companies")} />

            <Row className="row-cols-1 gap-2">
              {/* <Col>
                <FormFilterCompany
                  onGetFilterCompanies={onGetFilterCompanies}
                  setCompanies={setCompanies}
                />
              </Col> */}
              <Col>
                {isLoading ? (
                  <SpinnerCustom />
                ) : (
                  <Col className="col-12">
                    <CardList companies={companies} />
                  </Col>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </section>
    </Layout>
  );
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
