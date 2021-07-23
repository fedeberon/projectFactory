//Frameworks
import React from "react";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { Col, Row } from "react-bootstrap";

//Components
import PrimaryButton from "../../components/Buttons/PrimaryButton/PrimaryButton";

//Icons
import { GeoAlt } from "react-bootstrap-icons";

//Styles
import styles from "./Company.module.css";

const Company = (props) => {
  const { company } = props;
  const { t } = useTranslation("common");

  const getFirstCategory = () => company.categories.length > 0 ? company.categories[0].name : "";

  return (<>
    <div className={`${styles.company}`}>
      <Row className="no-gutters">
        <Col sm={5} md={4} lg={5} className={styles.figure}>
          <figure>
            <a href="prof-detail.php">
              <div className={`${styles.deg} deg`}></div>
              <img src={company.backgroundImage} className="photo" />
            </a>
          </figure>
        </Col>
        <Col sm={7} md={5} lg={5} className={styles.info}>
          <div className={styles.logo}><img src={company.previewImage} /></div>
          <div className={styles.m1}>
            <div className="name">
              <strong>{company.name}</strong>
              {getFirstCategory()}
            </div>
            <p>{company.description}</p>
          </div>
        </Col>
        <Col sm={12} md={3} lg={2}>
          <div className={`${styles.boxdeg} boxdeg`}>
            <h5><span className={`${styles.badge} badge`}>{company.countBuildingWorks}</span> {t("buildings")}</h5>
            <div className="d-flex">
              <GeoAlt className={styles.locationIcon}/>
              <div className={styles.location}>{company.location}. {`${t("province-of")} ${company.province}`}.</div>
            </div>
            <div className="d-flex justify-content-center">
              <Link href={`/companies/${company.name.replace(/\s+/g, "-")}-${company.id}`}>
                <PrimaryButton className="btn-sm">{t("view-more")}</PrimaryButton>
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  </>)
};

export default Company;
