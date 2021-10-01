//Frameworks
import React, { useState } from "react";
import { useSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";
import { Col, Row } from "react-bootstrap";
import Link from "next/link";
import { useSelector } from 'react-redux';

//Services
import * as magazineService from "../../services/magazineService";

//Components
import Layout from "../../components/Layout/Layout";
import Sidebar from "../../components/Sidebar/Sidebar";
import ContentHeader from "../../components/ContentHeader/ContentHeader";
import SpinnerCustom from "../../components/SpinnerCustom/SpinnerCustom";
import Magazine from "../../components/Magazine/Magazine";
import PrimaryButton from "../../components/Buttons/PrimaryButton/PrimaryButton";

const MagazineDetails = (props) => {
  const [session] = useSession();
  const { magazines } = props;
  const { t } = useTranslation("magazine");
  const categories = useSelector(state => state.categories.magazines);
  const [isLoading] = useState(false);

  const isRole = (role) => {
    if (session) {
      return session.authorities.includes(role);
    }
  };

  return (
    <Layout>
      <section className="container py-2">
        <Row>
          <Sidebar>
            <h3>{t("common:magazine")}</h3>
            <ul>
              {categories.map((category, index) => (
                <li key={index}>
                  <Link href={`/magazine?category=${category.name}`}>
                    <a>{category.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </Sidebar>

          <Col sm={12} md={8} lg={9}>
            <ContentHeader title={t("common:magazine")} />
            
            {isRole(process.env.NEXT_PUBLIC_ROLE_ADMINITRATOR) && 
              <div className="w-100 mb-4">
                <Link href="/magazine/create-magazine">
                  <PrimaryButton>{t("create-magazine")}</PrimaryButton>
                </Link>
              </div>
            }

            <Row className="gap-2">
              {isLoading ? (
                <SpinnerCustom />
              ) : (
                <>
                  {magazines.map((magazine) => (
                    <Col sm={12} md={6} lg={5} key={magazine.id}>
                      <Magazine magazine={magazine} description/>
                    </Col>
                  ))}
                </>
              )}
            </Row>
          </Col>
        </Row>
      </section>
    </Layout>
  );
};

export async function getServerSideProps({ query }) {
  let magazines;
  if (query.category) {
    magazines = await magazineService.findAllByCategory(query.category, "APPROVED", 0, 10);
  } else {
    magazines = await magazineService.findAll("APPROVED", 0, 10);
  }

  return {
    props: {
      magazines,
    },
  };
}
export default MagazineDetails;
