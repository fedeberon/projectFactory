// Frameworks
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { useSession, getSession } from "next-auth/client";
import { Col, Row, Tabs, Tab, Button, Card } from "react-bootstrap";
import { GeoAlt, PersonCircle } from "react-bootstrap-icons";

//Styles
import styles from "./index.module.css";

// Components
import Layout from "../../components/Layout/Layout";

// Services
import * as professionalService from "../../services/professionalService";
import * as buildingWorkService from "../../services/buildingWorkService";
import Company from "../../components/Company/Company";
import Link from "next/link";
import PrimaryButton from "../../components/Buttons/PrimaryButton/PrimaryButton";
import ImagesGroup from "../../components/ImagesGroup/ImagesGroup";
import useSize from "../../hooks/window/useSize";
import BackgroundDefault from "../../components/BackgroundDefault/BackgroundDefault";

const ProfessionalDetail = (props) => {
  const {
    professional,
    initialBuildingWorks,
    status,
    session,
    professionalId,
  } = props;

  const { t } = useTranslation("common");

  const [buildingWorks, setBuildingWorks] = useState(initialBuildingWorks);
  const [tabProfile, setTabProfile] = useState(<></>);
  const [isLoading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState({
    page: 1,
    size: process.env.NEXT_PUBLIC_SIZE_PER_PAGE,
  });
  const { width, height } = useSize();
  const [sizeIco, setSizeIco] = useState(78);

  const router = useRouter();
  const { id } = router.query;

  const changePage = () => {
    const { page } = { page: pageSize.page + 1 };
    setPageSize({ ...pageSize, page });
  };

  const fetchMoreData = () => {
    changePage();
  };

  useEffect(async () => {
    try {
      const newBuildingWorks = await buildingWorkService.getByProfessionalId(
        parseInt(professionalId),
        pageSize.page,
        pageSize.size
      );
      const count = await buildingWorkService.getCountByProfessional(
        professionalId
      );
      setBuildingWorks({
        ...buildingWorks,
        buildingWorks: [
          ...buildingWorks.buildingWorks,
          ...newBuildingWorks.buildingWorks,
        ],
        count: newBuildingWorks.count,
      });
    } catch (error) {
      console.error(error);
    }
  }, [pageSize]);

  useEffect(() => {
    if (width >= 1400) {
      setSizeIco(166);
    } else if (width >= 1200) {
      setSizeIco(166);
    } else if (width >= 992) {
      setSizeIco(166);
    } else if (width >= 768) {
      // Tablet 768px
      setSizeIco(166);
    } else if (width >= 576) {
      setSizeIco(166);
    } else if (width >= 425) {
      // Mobile L 425px
      setSizeIco(78);
    } else if (width >= 375) {
      // Mobile M 375px
      setSizeIco(78);
    } else if (width >= 320) {
      // Mobile S 320px
      setSizeIco(78);
    }
  }, [width]);

  useEffect(() => {
    if (initialBuildingWorks) {
      setBuildingWorks(initialBuildingWorks);
    }
  }, [initialBuildingWorks]);
  return (
    <Layout>
      <section className="container content">
        {professional.backgroundImage ? (
          <img
            src={professional.backgroundImage}
            className={`w-100 ${styles.backgroundImage}`}
          />
        ) : (
          <BackgroundDefault image={false} style={{ height: "140px" }} />
        )}

        <div className={styles.header}>
          <div className="position-absolute">
            <div className={styles.logoContainer}>
              {professional.previewImage ? (
                <img src={professional.previewImage} className={styles.logo} />
              ) : (
                <PersonCircle size={sizeIco} className={`${styles.ico}`} />
              )}
            </div>
          </div>

          <div className={styles.companyName}>
            <h2>{professional.contact}</h2>
            {professional.company && <h6>{professional.category.name}</h6>}
          </div>
        </div>

        <section className={styles.section}>
          <Row>
            <Col sm={12} md={4} lg={3}>
              <aside className="boxdeg">
                <div>
                  <div className={styles.location}>
                    <GeoAlt className={styles.locationIcon} />
                    {professional.company &&
                      `${professional.company.location}. ${t("province-of")} ${
                        professional.company.province
                      }.`}
                  </div>
                </div>

                <hr />

                <div>
                  <span className={styles.asideTitle}>{t("web-site")}</span>
                  {professional.company ? (
                    <span>{professional.company.email}</span>
                  ) : (
                    <span>{professional.website}</span>
                  )}
                </div>

                <hr />

                <div>
                  <span className={styles.asideTitle}>{t("company")}</span>
                  {professional.company && (
                    <span className="d-block">{professional.company.name}</span>
                  )}
                </div>

                <hr />
              </aside>
              <Card>
                <Card.Body>
                  <h6>{t("register-as-a-professional")}</h6>
                  <p>
                    {t("present-your-work-to-thousands-of-potential-clients")}
                  </p>
                  <Link href="/signIn">
                    <Button
                      className={`d-flex w-100 justify-content-center ${styles.pLine} ${styles.signInBtn} ${styles.btn} mx-1`}
                    >
                      {t("common:sign-in")}
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>

            <Col sm={12} md={8} lg={9}>
              <Tabs
                defaultActiveKey="buildingWorks"
                id="uncontrolled-tab-example"
                className={`${styles.tabs} mb-3`}
              >
                <Tab
                  eventKey="buildingWorks"
                  title={
                    <h5>
                      <span className="badge">{buildingWorks.count}</span>{" "}
                      {t("buildingWorks")}
                    </h5>
                  }
                >
                  <div className={styles.tabContent}>
                    {/* {buildingWorkList} */}
                    <ImagesGroup
                      isLoading={isLoading}
                      localBuildingWorks={buildingWorks}
                      fetchMoreData={fetchMoreData}
                      profileHidden={true}
                    />
                  </div>
                </Tab>

                <Tab eventKey="profile" title={<h5>{t("header.profile")}</h5>}>
                  <div className={styles.tabContent}>{tabProfile}</div>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </section>
      </section>
    </Layout>
  );
};

export async function getServerSideProps({ params, req, query, res, locale }) {
  const session = await getSession({ req });
  let { id } = params;
  const split = id.split("-");
  const professionalId = split[split.length - 1];
  const professional = await professionalService.getById(professionalId);
  let buildingWorks = [];
  let { page, size } = req.__NEXT_INIT_QUERY;

  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }

  try {
    if (professional) {
      buildingWorks = await buildingWorkService.getByProfessionalId(
        professional.id,
        page,
        size
      );
    }
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      professional,
      initialBuildingWorks: buildingWorks,
      status: query.status ? query.status : "",
      session,
      professionalId,
    },
  };
}

export default ProfessionalDetail;
