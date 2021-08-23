// Frameworks
import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/client";
import { Button, Col, Row } from "react-bootstrap";
import { CheckCircle, XCircle } from "react-bootstrap-icons";
import useTranslation from "next-translate/useTranslation";

// Components
import Layout from "../../components/Layout/Layout";
import Tabs from "../../components/Tabs/Tabs";
import TableAdmin from "../../components/TableAdmin/TableAdmin";
import { Input } from "react-bootstrap";

//Services
import * as professionalService from "../../services/professionalService";
import * as imageService from "../../services/imageService";
import ListAdmin from "../../components/ListAdmin/ListAdmin";

const Admin = ({
  professionalNotApproved,
  professionalApproved,
  professionalRejected,
  session,
}) => {
  const { t } = useTranslation("administrator");

  const listHead = (
    <>
      <th>{t("common:image")}</th>
      <th>{t("common:contact")}</th>
      <th>{t("common:company")}</th>
      <th>{t("common:email")}</th>
      <th>{t("common:date")}</th>
      <th>{t("common:table-admin.tokens")}</th>
      <th>{t("common:table-admin.actions")}</th>
    </>
  );

  return (
    <Layout title={t("common:administrator")}>
      <section className="container py-2">
        <Row>
          <Col>
            <ListAdmin
              notApproved={professionalNotApproved}
              approved={professionalApproved}
              rejected={professionalRejected}
              session={session}
              service={professionalService}
              imageService={imageService}
              listHead={listHead}
            />
          </Col>
        </Row>
      </section>
    </Layout>
  );
};

export async function getServerSideProps({ params, req, res, locale }) {
  // Get the user's session based on the request
  const session = await getSession({ req });

  if (
    !session ||
    !session.authorities.includes(process.env.NEXT_PUBLIC_ROLE_ADMINITRATOR)
  ) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  let token;

  let professionalNotApproved = [];
  let professionalApproved = [];
  let professionalRejected = [];
  let { page, size } = req.__NEXT_INIT_QUERY;

  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }

  if (session) {
    let status = "PENDING";
    token = session.accessToken;
    professionalNotApproved = await professionalService.getForApproved(
      status,
      page,
      size,
      token
    );
    status = "APPROVED";
    professionalApproved = await professionalService.getForApproved(
      status,
      page,
      size,
      token
    );
    status = "REJECTED";
    professionalRejected = await professionalService.getForApproved(
      status,
      page,
      size,
      token
    );
  }

  return {
    props: {
      professionalNotApproved,
      professionalApproved,
      professionalRejected,
      session,
    },
  };
}
export default Admin;
