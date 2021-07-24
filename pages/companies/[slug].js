import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import useTranslation from "next-translate/useTranslation";
import * as companyService from "../../services/companyService";
import * as buildingWorkService from "../../services/buildingWorkService";
import BuildingWork from "../../components/BuildingWork/BuildingWork";
import { Col, Row } from "react-bootstrap";
import styles from "./slug.module.css";
import { GeoAlt } from "react-bootstrap-icons";

const CompanyDetails = ({ company, initalBuildingWorks }) => {
  const { t } = useTranslation("common");
  const [buildingWorks, setBuildingWorks] = useState(initalBuildingWorks);

  return (
    <Layout>
      <section className="container py-2">
        <img
          src={company.backgroundImage}
          className={`w-100 ${styles.backgroundImage}`}
        />

        <div className={styles.header}>
          <div className="position-absolute">
            <div className={styles.logoContainer}>
              <img src={company.previewImage} className={styles.logo} />
            </div>
          </div>

          <div className={styles.companyName}>
            <h2>{company.name}</h2>
            <GeoAlt className={styles.locationIcon} />
            <span className={styles.location}>
              <span>{company.location}.</span> {company.province}
            </span>
          </div>
        </div>

        <section className={styles.section}>
          <aside className={styles.aside}>
            <div>
              <span className={styles.asideTitle}>{t("web-site")}</span>
              <span>{company.email}</span>
            </div>

            <hr />

            <div>
              <span className={styles.asideTitle}>
                {t("company-creator.categories")}
              </span>
              {company.categories.map((category, index) => (
                <span key={index} className="d-block">
                  {category.name}
                </span>
              ))}
            </div>

            <hr />
          </aside>

          <Row className="row-cols-1 row-cols-lg-2 row-cols-xl-3 g-4">
            {buildingWorks.map((buildingWork) => (
              <Col key={buildingWork.id}>
                <BuildingWork buildingWork={buildingWork} />
              </Col>
            ))}
          </Row>
        </section>
      </section>
    </Layout>
  );
};

export async function getServerSideProps({ params, req, query, res, locale }) {
  let { slug } = params;
  const split = slug.split("-");
  const companyId = split[split.length - 1];
  const company = await companyService.findById(companyId);
  const initalBuildingWorks = await buildingWorkService.getAllByCompanyId(
    companyId,
    0,
    10
  );
  return {
    props: {
      company,
      initalBuildingWorks,
    },
  };
}

export default CompanyDetails;
