//Frameworks
import React, { useState, useEffect } from "react";
import useTranslation from "next-translate/useTranslation";
import parse from 'html-react-parser'
import Link from "next/link";

//Services
import * as magazineService from "../../services/magazineService";
import * as categoryService from "../../services/categoryService";

//Components
import PrimaryButton from "../../components/Buttons/PrimaryButton/PrimaryButton";
import Layout from "../../components/Layout/Layout";
import { Col, Row } from "react-bootstrap";
import { Share } from "react-bootstrap-icons";
import Magazine from "../../components/Magazine/Magazine";

//Styles
import styles from "./slug.module.css";
import { useSelector } from "react-redux";

const MagazineDetail = (props) => {
  const { magazine } = props;
  const [relationatedMagazines, setRelationatedMagazines] = useState([]);
  const categories = useSelector(state => state.categories.magazines);
  const { t } = useTranslation("common");

  useEffect(async () => {
    const relationatedMagazines = await magazineService.findAllByCategory(magazine.category.name, "APPROVED", 0, 6);
    setRelationatedMagazines(relationatedMagazines);
  }, []);

  /**
   * Format date in yyyy-MM-dd to text
   * Example from "2021-08-01" to "1 of August of 2021"
   * @param {String} date 
   * @returns {String} formated date
   */
  const prettyDateFormat = (date) => {
    const year = date.substring(0,4);
    const monthNumber = date.substring(5,7);
    const monthWord = t(`month-${monthNumber}`);
    const dayNumberWithZero = date.substring(8,10);
    const dayNumber = dayNumberWithZero.charAt(0) === '0' ? dayNumberWithZero.replace("0", "") : dayNumberWithZero;
    return `${dayNumber} ${t("of")} ${monthWord} ${t("of")} ${year}`;
  };

  return (
    <Layout>
      <section className="container">
        <Row>
          <Col className="col-12">
            <nav className={styles.breadcrumb}>
              <span><Link href="/magazine"><a>{t("magazine")}</a></Link></span>
              <span> / </span>
              <span><Link href={`/magazine?category=${magazine.category.name}`}><a>{magazine.category.name}</a></Link></span>
            </nav>
          </Col>

          <Col sm={12} md={8} lg={9}>
            <Row>
              <Col sm={12}>
                
                <div className={`${styles.magList} detail`}>
                  <figure>
                    <div className={styles.label}>{magazine.category.name}</div>
                    <img src={magazine.previewImage} className={styles.photo} />
                  </figure>
                  <div className={styles.info}>
                    <h1 className={styles.name}>{magazine.title}</h1>
                    <p>{magazine.description}</p>
                  </div>
                  <Row className={styles.author}>
                    <Col className="col-6">
                      <div className={styles.by}>
                        <strong>{magazine.author}</strong>
                        <span>{prettyDateFormat(magazine.datePublished)}</span>
                      </div> 
                    </Col>
                    <Col className="col-6 text-right">
                      <PrimaryButton className="float-right">
                        <Share size={15} /> {t("shared")}
                      </PrimaryButton>
                    </Col>
                  </Row>
                  <Row>
                    <div className="col magazine-nota">
                      {parse(magazine.content)}
                    </div>
                    <div className="text-right">
                      <PrimaryButton className="float-right">
                        <Share size={15} /> {t("shared")}
                      </PrimaryButton>
                    </div>
                  </Row>
                </div>
              </Col>

              <Col className="col-12">
                <h6 className={styles.tit}>{t("you-may-also-like")}</h6>
              </Col>

              <Col className="col-12">
                <Row className="g-4">
                  {relationatedMagazines.map(magazine => 
                    <Col sm={12} md={6} lg={6} key={magazine.id}>
                      <Magazine magazine={magazine}/>
                    </Col>
                  )}
                </Row>
              </Col>

            </Row>
          </Col>

          <Col sm={12} md={4} lg={3}>
            <div className={`${styles.moduleFilter} boxdeg mb-3`}>
              <h3>{t("magazine")}</h3>
              <ul className={styles.ul}>
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link href={`/magazine?category=${category.name}`}>
                      <a>{category.name}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>
      </section>
    </Layout>
  );
};

export async function getStaticProps({ params }) {
  let { slug } = params; // params is necessary in case you reload the page from the url
  const split = slug.split("-");
  const magazineId = split[split.length - 1];
  const magazine = await magazineService.getById(magazineId);

  return {
    props: {
      magazine,
    },
  };
}

export const getStaticPaths = async () => {

  return {
      paths: [], //indicates that no page needs be created at build time
      fallback: 'blocking' //indicates the type of fallback
  }
}

export default MagazineDetail;
