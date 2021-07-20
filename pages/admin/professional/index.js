// Frameworks
import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/client";
import { Button, Col, Row } from "reactstrap";
import { CheckCircle, XCircle } from "react-bootstrap-icons";
import useTranslation from "next-translate/useTranslation";

// Components
import Layout from "../../../components/Layout/Layout";
import Tabs from "../../../components/Tabs/Tabs";
import TableAdmin from "../../../components/TableAdmin/TableAdmin";
import { Input } from "reactstrap";

//Services
import * as professionalService from "../../../services/professionalService";
import * as imageService from "../../../services/imageService";
import Link from "next/link";

const ProfessionalAdmin = ({
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

  const { t, lang } = useTranslation("administrator");

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
        <CheckCircle size={25} /> {t("accept")}
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
        <XCircle size={25} /> {t("reject")}
      </Button>
    );
  };

  /**
   * Component button that accept all images of one professional.
   * @param {*} professionalId String necessary to identify the profesisonal
   * in acceptImages
   * @returns A button armed with the functionality to change the state to Id.
   */
  const buttonAcceptImages = (professionalId) => {
    return (
      // <Button
      //   outline
      //   color={"success"}
      //   onClick={async () => changeStateImages(professionalId, true)}
      // >
      //   <CheckCircle size={25} /> {t("accept-images")}
      // </Button>
      <Link href={"/admin/building"}>
        <Button
          outline
          color={"success"}
          // onClick={async () => changeStateImages(professionalId, true)}
        >
          <CheckCircle size={25} /> {t("managing-images")}
        </Button>
      </Link>
    );
  };

  const changeStateImages = async (id, approved) => {
    await imageService.changeStateImagesByProfessionalId(
      id,
      approved,
      session.accessToken
    );
    pendingTab();
    approvedTab();
    disapprovedTab();
    alert(t("images-accepted"));
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
      await professionalService.setEnebleProfessional(id, status, session?.accessToken);
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
    renderPendingProfessionals(professionals);
  };

  const renderPendingProfessionals = (professionals) => {
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
    renderApprovedProfessionals(professionals);
  };

  const renderApprovedProfessionals = (professionals) => {
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
    renderRejectedProfessionals(professionals);
  };

  const renderRejectedProfessionals = (professionals) => {
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
      const professionalNotApproved = await professionalService.getForApproved(
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

  const getListHead = (
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
          <td>{professional.contact}</td>
          <td>{professional.company.name}</td>
          <td>{professional.email}</td>
          <td>{professional.statusUpdate}</td>
          <td>
            <Input
              min="0"
              type="number"
              className="d-inline-block w-50 mr-2"
              defaultValue={professional.tokensAsigned}
            />
            <Button
              onClick={(e) =>
                setNewTokensToProfessional(
                  e.target.previousElementSibling.value,
                  professional.id
                )
              }
            >
              {t("apply")}
            </Button>
          </td>
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

  const setNewTokensToProfessional = async (tokens, professionalId) => {
    await professionalService.setNewTokensToProfessional(
      tokens,
      professionalId,
      session.accessToken
    );
    alert(t("tokens-setted"));
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
  const titles = [t("pending"), t("approved"), t("disapproved")];

  /**
   * Find all professionals by username and status, if username is empty, only find by status
   * when get all professionals, the method will render them
   */
  const findByContactAndStatus = async (username, status) => {
    let newProfessionals;

    if (username != "")
      newProfessionals = await professionalService.findByContactAndStatus(
        username,
        status,
        pageSize.page,
        pageSize.size
      );
    else newProfessionals = await getProfessional(status);

    switch (status) {
      case "PENDING":
        renderPendingProfessionals(newProfessionals);
        break;
      case "APPROVED":
        renderApprovedProfessionals(newProfessionals);
        break;
      case "REJECTED":
        renderRejectedProfessionals(newProfessionals);
        break;
    }
  };

  return (
    <Layout title={t("managing-professionals")}>
      <Row>
        <Col>
          <Tabs titles={titles}>
            <TableAdmin
              listHead={getListHead}
              listBody={professionalListNotAppoved}
              title={titles[0]}
              onSearch={(username) =>
                findByContactAndStatus(username, "PENDING")
              }
            />
            <TableAdmin
              listHead={getListHead}
              listBody={professionalListAppoved}
              title={titles[1]}
              onSearch={(username) =>
                findByContactAndStatus(username, "APPROVED")
              }
            />
            <TableAdmin
              listHead={getListHead}
              listBody={professionalListRejected}
              title={titles[2]}
              onSearch={(username) =>
                findByContactAndStatus(username, "REJECTED")
              }
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
export default ProfessionalAdmin;
