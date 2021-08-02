// Frameworks
import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/client";
import useTranslation from "next-translate/useTranslation";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";

// Components
import Layout from "../../components/Layout/Layout";
import SpinnerCustom from "../../components/SpinnerCustom/SpinnerCustom";

// Services
import * as professionalService from "../../services/professionalService";

// Store
import { professionalActions } from "../../store";

// Styles
import indexStyles from "./index.module.css";

const Professional = ({ data }) => {
  const [isLoading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const professionals = useSelector((state) =>
    Object.values(state.professionals.items)
  );

  const { t } = useTranslation("professional");

  useEffect(() => {
    dispatch(professionalActions.store(data));
  }, [data]);

  return (
    <Layout title={`${t("common:professional")}`}>
      <section className="container py-2">
        <Row className="row-cols-md-3 g-4">
          {isLoading ? (
            <SpinnerCustom />
          ) : (
            professionals.map((professional, index) => (
              <Col key={index}>
                <Card>
                  <Card.Img
                    className="img-fluid"
                    src={professional.previewImage}
                    alt="Professional preview"
                  />
                  <Card.Body>
                    <Card.Text>
                      {t("common:contact")}: {professional.contact}
                    </Card.Text>
                    <Card.Text>
                      {t("common:company")}: {professional?.company?.name}
                    </Card.Text>
                    <Card.Text>
                      {t("common:email")}: {professional.email}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </section>
    </Layout>
  );
};

export async function getServerSideProps({ params, req, res, locale }) {
  // Get the user's session based on the request
  const session = await getSession({ req });

  let professionals = [];
  let { page, size } = req.__NEXT_INIT_QUERY;

  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }

  professionals = await professionalService.findAll(page, size);

  return {
    props: {
      data: professionals,
    },
  };
}
export default Professional;
