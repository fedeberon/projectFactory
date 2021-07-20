// Frameworks
import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/client";
import { Button, Col, Form, Row } from "react-bootstrap";
import { CheckCircle, XCircle } from "react-bootstrap-icons";
import useTranslation from "next-translate/useTranslation";

// Components
import Layout from "../../../components/Layout/Layout";
import Tabs from "../../../components/Tabs/Tabs";
import TableAdmin from "../../../components/TableAdmin/TableAdmin";

//Services
import * as professionalService from "../../../services/professionalService";
import * as imageService from "../../../services/imageService";
import * as companyService from "../../../services/companyService";

const CompanyAdmin = ({
  companiesNotApproved,
  companiesApproved,
  companiesRejected,
  session,
}) => {
  const [pageSize, setPageSize] = useState({ page: 0, size: 10 });
  const [companyListNotAppoved, setCompanyListNotAppoved] = useState([]);
  const [companiesListAppoved, setListAppoved] = useState([]);
  const [companiesListRejected, setcompaniesListRejected] = useState([]);

  const { t } = useTranslation("administrator");

  /**
   * Component button accept to add it to the table that requires it.
   * @param {*} professionalId String necessary to identify the profesisonal
   * in changeState
   * @returns A button armed with the functionality to change the state to Id
   */
  const buttonAccept = (companylId) => {
    return (
      <Button
        variant={"outline-success"}
        onClick={() => changeState(companylId, "APPROVED")}
      >
        <CheckCircle size={25} /> {t("accept")}
      </Button>
    );
  };

  /**
   * Component button reject to add it to the table that requires it.
   * @param {*} companyId String necessary to identify the profesisonal
   * in changeState
   * @returns A button armed with the functionality to change the state to Id.
   */
  const buttonReject = (companyId) => {
    return (
      <Button
        variant={"outline-danger"}
        onClick={() => changeState(companyId, "REJECTED")}
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
      <Button
        variant={"outline-success"}
        onClick={async () => changeStateImages(professionalId, true)}
      >
        <CheckCircle size={25} /> {t("accept-images")}
      </Button>
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
   * to change the status of a company in a tabs pending, approved and
   * disapproved.
   * @param {*} id String necessary to identify of a company.
   * @param {*} status String to show that you want it to see.
   * The states are : PENDING APPROVED REJECTED DELETED
   */
  const changeState = async (id, status) => {
    const professionalChange = await saveChangeStatus(id, status);
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
  const saveChangeStatus = async (id, status) => {
    try {
      await companyService.setStatus(id, status, session?.accessToken);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  /**
   * Funtionality to refresh the pending tab when a company is accepted.
   */
  const pendingTab = async () => {
    const companies = await getAllCompanies("PENDING");
    renderPending(companies);
  };

  const renderPending = (companies) => {
    const companiesList = getList(companies, [
      (companyId) => buttonAccept(companyId),
      (companyId) => buttonReject(companyId),
    ]);
    setCompanyListNotAppoved(companiesList);
  };

  /**
   * Funcionality to refresh the approved tab when a professional is rejected.
   */
  const approvedTab = async () => {
    const companies = await getAllCompanies("APPROVED");
    renderApproved(companies);
  };

  const renderApproved = (companies) => {
    const companiesList = getList(companies, [
      (companyId) => buttonReject(companyId),
    ]);
    setListAppoved(companiesList);
  };

  /**
   * Funcionality to refresh the disapproved tab when you want to accept
   * a professional again.
   */
  const disapprovedTab = async () => {
    const companies = await getAllCompanies("REJECTED");
    renderRejectedProfessionals(companies);
  };

  const renderRejectedProfessionals = (professionals) => {
    const professionalsList = getList(professionals, [
      (professionalId) => buttonAccept(professionalId),
    ]);
    setcompaniesListRejected(professionalsList);
  };

  /**
   * Request "fetch" to obtain approved, disapproved, rejected or deleted
   * professionals, depends on the "status" parameter and with error control.
   * @param {*} status String to show that you want it to see.
   * The states are: PENDING APPROVED REJECTED DELETED
   * @returns arrangement of professionally limited for page.
   */
  const getAllCompanies = async (status) => {
    try {
      const companiesNotAppoved = await companyService.findAll(
        status,
        pageSize.page,
        pageSize.size,
        session?.accessToken
      );
      return companiesNotAppoved;
    } catch (error) {
      console.error(error);
    }
  };

  const getCompaniesForApproved = async (status) => {
    try {
      const companiesNotApproved = await companyService.findAll(
        status,
        pageSize.page,
        pageSize.size,
        session?.accessToken
      );
      return companiesNotApproved;
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
  const getList = (companies, buttons) => {
    const companiesList = companies.map((company, index) => {
      return (
        <tr key={index} className="align-middle text-center">
          <td scope="row">{index + 1}</td>
          <td width="150px">
            <figure className="figure mx-auto">
              <img
                className="img-fluid rounded"
                src={company.previewImage}
                alt=""
              />
            </figure>
          </td>
          <td>{company.contact}</td>
          <td>{company.name}</td>
          <td>{company.email}</td>
          <td>{company.statusUpdate}</td>
          <td>
            <Form.Control
              min="0"
              type="number"
              className="d-inline-block w-50 mr-2"
              defaultValue={company.tokensAsigned}
            />
            <Button
            // onClick={(e) =>
            //   setNewTokensToProfessional(
            //     e.target.previousElementSibling.value,
            //     company.id
            //   )
            // }
            >
              {t("apply")}
            </Button>
          </td>
          <td>
            {buttons.map((button, index) => {
              return <div key={index}>{button(company.id)}</div>;
            })}
          </td>
        </tr>
      );
    });
    return companiesList;
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
   * with the list of pending companies.
   */
  useEffect(async () => {
    if (companiesNotApproved) {
      const companiesList = getList(companiesNotApproved, [
        (companyId) => buttonAccept(companyId),
        (companyId) => buttonReject(companyId),
      ]);
      setCompanyListNotAppoved(companiesList);
    }
  }, [companiesNotApproved]);

  /**
   * This is for when using the SSR and loading the tableAdmin component properly
   * with the list of approved proffesional.
   */
  useEffect(async () => {
    if (companiesApproved) {
      const professionalList = getList(companiesApproved, [
        (professionalId) => buttonReject(professionalId),
      ]);
      setListAppoved(professionalList);
    }
  }, [companiesApproved]);

  /**
   * This is for when using the SSR and loading the tableAdmin component properly
   * with the list of disapproved proffesional.
   */
  useEffect(async () => {
    if (companiesRejected) {
      const professionalList = getList(companiesRejected, [
        (professionalId) => buttonAccept(professionalId),
      ]);
      setcompaniesListRejected(professionalList);
    }
  }, [companiesRejected]);

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
        renderPending(newProfessionals);
        break;
      case "APPROVED":
        renderApproved(newProfessionals);
        break;
      case "REJECTED":
        renderRejectedProfessionals(newProfessionals);
        break;
    }
  };

  return (
    <Layout title={t("managing-companies")}>
      <section className="container py-2">
        <Row>
          <Col>
            <Tabs titles={titles}>
              <TableAdmin
                listHead={getListHead}
                listBody={companyListNotAppoved}
                title={titles[0]}
                onSearch={(username) =>
                  findByContactAndStatus(username, "PENDING")
                }
              />
              <TableAdmin
                listHead={getListHead}
                listBody={companiesListAppoved}
                title={titles[1]}
                onSearch={(username) =>
                  findByContactAndStatus(username, "APPROVED")
                }
              />
              <TableAdmin
                listHead={getListHead}
                listBody={companiesListRejected}
                title={titles[2]}
                onSearch={(username) =>
                  findByContactAndStatus(username, "REJECTED")
                }
              />
            </Tabs>
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

  let companiesApproved = [];
  let companiesRejected = [];
  let companiesNotApproved = [];
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
    companiesNotApproved = await companyService.findAll(
      status,
      page,
      size,
      token
    );

    status = "APPROVED";
    companiesApproved = await companyService.findAll(status, page, size, token);
    status = "REJECTED";
    companiesRejected = await companyService.findAll(status, page, size, token);
  }

  return {
    props: {
      companiesNotApproved,
      companiesApproved,
      companiesRejected,
      session,
    },
  };
}
export default CompanyAdmin;
