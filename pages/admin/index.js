// Frameworks
import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/client";
import { Button, Col, Row } from "reactstrap";
import { CheckCircle, XCircle } from "react-bootstrap-icons";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";

// Components
import Layout from "../../components/Layout";
import Tabs from "../../components/Tabs/Tabs";
import TableAdmin from "../../components/TableAdmin/TableAdmin";

//Services
import {
  getProfessionalForApproved,
  setEnebleProfessional,
} from "../../services/professionalService";

const Admin = ({
  professionalNotApproved,
  professionalApproved,
  professionalRejected,
  session,
}) => {
  const [pageSize, setPageSize] = useState({ page: 0, size: 10 });
  const [professionalListNotAppoved, setProfessionalListNotAppoved] = useState(
    []
  );
  const [professionalListAppoved, setProfessionalListAppoved] = useState([]);
  const [professionalListRejected, setProfessionalListRejected] = useState([]);

  const { t, lang } = useTranslation("common");

  /**
   * Component button accept to add it to the table that requires it.
   * @param {*} professionalId String necessary to identify the profesisonal
   * in changeStateProfessional
   * @returns A button armed with the functionality to change the state to Id
   */
  const buttonAccept = (professionalId) => {
    return (
      <Button
        outline
        color={"success"}
        onClick={() => changeStateProfessional(professionalId, "APPROVED")}
      >
        <CheckCircle size={25} /> {t("Accept")}
      </Button>
    );
  };

  /**
   * Component button reject to add it to the table that requires it.
   * @param {*} professionalId String necessary to identify the profesisonal
   * in changeStateProfessional
   * @returns A button armed with the functionality to change the state to Id.
   */
  const buttonReject = (professionalId) => {
    return (
      <Button
        outline
        color={"danger"}
        onClick={() => changeStateProfessional(professionalId, "REJECTED")}
      >
        <XCircle size={25} /> {t("Reject")}
      </Button>
    );
  };

  /**
   * Funtionality to buttonAcept and buttonReject components
   * to change the status of a professional in a tabs pending, approved and
   * disapproved.
   * @param {*} id String necessary to identify of a professional.
   * @param {*} status String to show that you want it to see.
   * The states are : PENDING APPROVED REJECTED DELETED
   */
  const changeStateProfessional = async (id, status) => {
    const professionalChange = await saveChangeProfessional(id, status);
    if (professionalChange) {
      pendingTab();
      approvedTab();
      disapprovedTab();
    }
  };

  /**
   * Request "fetch" to the DB that changes the status of a professional.
   * @param {*} id String is necessary to identify a professional
   * @param {*} status String to show that you want it to see.
   * The states are : PENDING APPROVED REJECTED DELETED
   * @returns true or false to obtein if save change or not
   */
  const saveChangeProfessional = async (id, status) => {
    try {
      await setEnebleProfessional(id, status, session?.accessToken);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  /**
   * Funtionality to refresh the pending tab when a professional is accepted.
   */
  const pendingTab = async () => {
    const professionals = await getProfessional("PENDING");
    const professionalsList = getList(professionals, [
      (professionalId) => buttonAccept(professionalId),
      (professionalId) => buttonReject(professionalId),
    ]);
    setProfessionalListNotAppoved(professionalsList);
  };

  /**
   * Funcionality to refresh the approved tab when a professional is rejected.
   */
  const approvedTab = async () => {
    const professionals = await getProfessional("APPROVED");
    const professionalsList = getList(professionals, [
      (professionalId) => buttonReject(professionalId),
    ]);
    setProfessionalListAppoved(professionalsList);
  };

  /**
   * Funcionality to refresh the disapproved tab when you want to accept
   * a professional again.
   */
  const disapprovedTab = async () => {
    const professionals = await getProfessional("REJECTED");
    const professionalsList = getList(professionals, [
      (professionalId) => buttonAccept(professionalId),
    ]);
    setProfessionalListRejected(professionalsList);
  };

  /**
   * Request "fetch" to obtain approved, disapproved, rejected or deleted
   * professionals, depends on the "status" parameter and with error control.
   * @param {*} status String to show that you want it to see.
   * The states are: PENDING APPROVED REJECTED DELETED
   * @returns arrangement of professionally limited for page.
   */
  const getProfessional = async (status) => {
    try {
      const professionalNotApproved = await getProfessionalForApproved(
        status,
        pageSize.page,
        pageSize.size,
        session?.accessToken
      );
      return professionalNotApproved;
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Complete the body part of the table showing the result of the pending,
   * approved or rejected professional consultations.
   * @param {*} professionals these are the professionals who arrive
   * from a request "fetch" from the BD
   * @param {*} buttons is the buttons you want to display in the table as actions.
   * @returns the body of the table.
   */
  const getList = (professionals, buttons) => {
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
          <td>
            {buttons.map((button, index) => {
              return <div key={index}>{button(professional.id)}</div>;
            })}
          </td>
        </tr>
      );
    });
    return professionalList;
  };

  /**
   * This is for when using the SSR and loading the tableAdmin component properly
   * with the list of pending proffesional.
   */
  useEffect(async () => {
    if (professionalNotApproved) {
      const professionalList = getList(professionalNotApproved, [
        (professionalId) => buttonAccept(professionalId),
        (professionalId) => buttonReject(professionalId),
      ]);
      setProfessionalListNotAppoved(professionalList);
    }
  }, [professionalNotApproved]);

  /**
   * This is for when using the SSR and loading the tableAdmin component properly
   * with the list of approved proffesional.
   */
  useEffect(async () => {
    if (professionalApproved) {
      const professionalList = getList(professionalApproved, [
        (professionalId) => buttonReject(professionalId),
      ]);
      setProfessionalListAppoved(professionalList);
    }
  }, [professionalApproved]);

  /**
   * This is for when using the SSR and loading the tableAdmin component properly
   * with the list of disapproved proffesional.
   */
  useEffect(async () => {
    if (professionalRejected) {
      const professionalList = getList(professionalRejected, [
        (professionalId) => buttonAccept(professionalId),
      ]);
      setProfessionalListRejected(professionalList);
    }
  }, [professionalRejected]);

  /**
   * These are the titles of the tabs needed to describe each other.
   */
  const titles = [t("Pending"), t("Approved"), t("Disapproved")];

  return (
    <Layout title={t("Administrator")}>
      <Row>
        <Col>
          <Tabs titles={titles}>
            <TableAdmin
              professionalList={professionalListNotAppoved}
              title={titles[0]}
            />
            <TableAdmin
              professionalList={professionalListAppoved}
              title={titles[1]}
            />
            <TableAdmin
              professionalList={professionalListRejected}
              title={titles[2]}
            />
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
    professionalNotApproved = await getProfessionalForApproved(
      status,
      page,
      size,
      token
    );
    status = "APPROVED";
    professionalApproved = await getProfessionalForApproved(
      status,
      page,
      size,
      token
    );
    status = "REJECTED";
    professionalRejected = await getProfessionalForApproved(
      status,
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
      professionalRejected,
      session,
    },
  };
}
export default Admin;
