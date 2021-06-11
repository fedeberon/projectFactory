import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/client";
import { Button, Col, Row } from "reactstrap";
import Layout from "../../components/Layout";
import {
  getProfessionalForApproved,
  setEnebleProfessional,
} from "../../services/professionalService";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { CheckCircle, XCircle } from "react-bootstrap-icons";
import Tabs from "../../components/Tabs/Tabs";
import TableAdmin from "../../components/TableAdmin/TableAdmin";
import { useTranslation } from "react-i18next";

const Admin = ({ professionalNotApproved, professionalApproved, session }) => {
  const [pageSize, setPageSize] = useState({ page: 0, size: 10 });
  const [professionalListNotAppoved, setProfessionalListNotAppoved] = useState(
    []
  );
  const [professionalListAppoved, setProfessionalListAppoved] = useState([]);

  const { t, lang } = useTranslation("common");

  const buttonAccept = (professionalId) => {
    return (
      <Button
        outline
        color={"success"}
        onClick={() => changeStateProfessional(professionalId, true)}
      >
        <CheckCircle size={25} /> {t("Accept")}
      </Button>
    );
  };

  const buttonReject = (professionalId) => {
    return (
      <Button
        outline
        color={"danger"}
        onClick={() => changeStateProfessional2(professionalId, false)}
      >
        <XCircle size={25} /> {t("Reject")}
      </Button>
    );
  };

  const getProfessional = async (approved) => {
    try {
      const professionalNotApproved = await getProfessionalForApproved(
        approved,
        pageSize.page,
        pageSize.size,
        session?.accessToken
      );
      return professionalNotApproved;
    } catch (error) {
      console.error(error);
    }
  };

  const saveChangeProfessional = async (id, approved) => {
    try {
      await setEnebleProfessional(id, approved, session?.accessToken);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const changeStateProfessional = async (id, approved) => {
    const professionalChange = await saveChangeProfessional(id, approved);
    if (professionalChange) {
      const professionals = await getProfessional(false);
      const callback = (professionalId) => {
        return buttonAccept(professionalId);
      };
      const professionalsList = getList(professionals, callback);
      setProfessionalListNotAppoved(professionalsList);
    }
  };

  const changeStateProfessional2 = async (id, approved) => {
    const professionalChange = await saveChangeProfessional(id, approved);
    if (professionalChange) {
      const professionals = await getProfessional(true);
      const callback = (professionalId) => {
        return buttonReject(professionalId);
      };
      const professionalsList = getList(professionals, callback);
      setProfessionalListAppoved(professionalsList);
    }
  };

  const getList = (professionals, button) => {
    const professionalList = professionals.map((professional, index) => {
      return (
        <tr key={index} className="align-middle text-center">
          <td scope="row">{index + 1}</td>
          <td width="150px">
            <figure className="figure mx-auto">
              <img
                className="img-fluid rounded"
                src={professional.previewImage}
                alt=""
              />
            </figure>
          </td>
          <td>{professional.firstName}</td>
          <td>{professional.lastName}</td>
          <td>{professional.email}</td>
          <td>{button(professional.id)}</td>
        </tr>
      );
    });
    return professionalList;
  };

  useEffect(async () => {
    if (professionalNotApproved) {
      const callback = (professionalId) => {
        return buttonAccept(professionalId);
      };
      const professionalList = getList(professionalNotApproved, callback);
      setProfessionalListNotAppoved(professionalList);
    }
  }, [professionalNotApproved]);

  useEffect(async () => {
    if (professionalApproved) {
      const callback = (professionalId) => {
        return buttonReject(professionalId);
      };
      const professionalList = getList(professionalApproved, callback);
      setProfessionalListAppoved(professionalList);
    }
  }, [professionalApproved]);

  const titles = [t("Pendings"), t("Approveds"), t("Disapproved")];

  return (
    <Layout title={t("Administrator")}>
      <Row>
        <Col>
          <Tabs titles={titles}>
            <TableAdmin professionalList={professionalListNotAppoved} />
            <TableAdmin professionalList={professionalListAppoved} />
            <TableAdmin professionalList={professionalListAppoved} />
          </Tabs>
        </Col>
      </Row>
    </Layout>
  );
};

export async function getServerSideProps({ params, req, res, locale }) {
  // Get the user's session based on the request
  const session = await getSession({ req });

  let token;

  let professionalNotApproved = [];
  let professionalApproved = [];
  let { page, size } = req.__NEXT_INIT_QUERY;

  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }

  if (session) {
    let approved = false;
    token = session.accessToken;
    professionalNotApproved = await getProfessionalForApproved(
      approved,
      page,
      size,
      token
    );
    approved = true;
    professionalApproved = await getProfessionalForApproved(
      approved,
      page,
      size,
      token
    );
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      professionalNotApproved,
      professionalApproved,
      session,
    },
  };
}
export default Admin;
