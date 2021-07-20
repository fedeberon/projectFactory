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
import * as imageService from "../../../services/imageService";
import * as buildingWorkService from "../../../services/buildingWorkService";

const BuildingAdmin = ({
  buildingWorksNotApproved,
  buildingWorksApproved,
  buildingWorksRejected,
  session,
}) => {
  const [pageSize, setPageSize] = useState({ page: 0, size: 10 });
  const [buildingWorkListNotAppoved, setBuildingWorkListNotAppoved] = useState([]);
  const [buildingWorksListAppoved, setListAppoved] = useState([]);
  const [buildingWorksListRejected, setBuildingWorksListRejected] = useState([]);
  
  const { t } = useTranslation("administrator");

  /**
   * Component button accept to add it to the table that requires it.
   * @param {*} buildingWorklId String necessary to identify the buildingWorks
   * in changeState
   * @returns A button armed with the functionality to change the state to Id
   */
  const buttonAccept = (buildingWorklId) => {
    return (
      <Button
        outline
        color={"success"}
        onClick={() => changeState(buildingWorklId, "APPROVED")}
      >
        <CheckCircle size={25} /> {t("accept")}
      </Button>
    );
  };

  /**
   * Component button reject to add it to the table that requires it.
   * @param {*} buildingWorkId String necessary to identify the profesisonal
   * in changeState
   * @returns A button armed with the functionality to change the state to Id.
   */
  const buttonReject = (buildingWorkId) => {
    return (
      <Button
        outline
        color={"danger"}
        onClick={() => changeState(buildingWorkId, "REJECTED")}
      >
        <XCircle size={25} /> {t("reject")}
      </Button>
    );
  };

  /**
   * Component button that accept all images of one buildingWorkId.
   * @param {*} buildingWorkId String necessary to identify the profesisonal
   * in acceptImages
   * @returns A button armed with the functionality to change the state to Id.
   */
  const buttonAcceptImages = (buildingWorkId) => {
    return (
      <Button
        outline
        color={"success"}
        onClick={async () => changeStateImages(buildingWorkId, true)}
      >
        <CheckCircle size={25} /> {t("accept-images")}
      </Button>
    );
  };

  const changeStateImages = async (id, approved) => {
    await imageService.changeStateImagesByBuildingWorkId(
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
   * to change the status of a buildingWork in a tabs pending, approved and
   * disapproved.
   * @param {*} id String necessary to identify of a buildingWork.
   * @param {*} status String to show that you want it to see.
   * The states are : PENDING APPROVED REJECTED DELETED
   */
  const changeState = async (id, status) => {
    const buildingWorkChange = await saveChangeStatus(id, status);
    if (buildingWorkChange) {
      pendingTab();
      approvedTab();
      disapprovedTab();
    }
  };

  /**
   * Request "fetch" to the DB that changes the status of a buildingWork.
   * @param {*} id String is necessary to identify a buildingWork
   * @param {*} status String to show that you want it to see.
   * The states are : PENDING APPROVED REJECTED DELETED
   * @returns true or false to obtein if save change or not
   */
  const saveChangeStatus = async (id, status) => {
    try {
      await buildingWorkService.setStatus(id, status, session?.accessToken);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  /**
   * Funtionality to refresh the pending tab when a buildingWork is accepted.
   */
  const pendingTab = async () => {
    const buildingWorks = await getAllBuildingWorks("PENDING");
    renderPending(buildingWorks);
  };

  const renderPending = (buildingWorks) => {
    const buildingWorksList = getList(buildingWorks, [
      (buildingWorkId) => buttonAccept(buildingWorkId),
      (buildingWorkId) => buttonReject(buildingWorkId),
    ]);
    setBuildingWorkListNotAppoved(buildingWorksList);
  };

  /**
   * Funcionality to refresh the approved tab when a buildingWork is rejected.
   */
  const approvedTab = async () => {
    const buildingWorks = await getAllBuildingWorks("APPROVED");
    renderApproved(buildingWorks);
  };

  const renderApproved = (buildingWorks) => {
    const buildingWorksList = getList(buildingWorks, [
      (buildingWorkId) => buttonReject(buildingWorkId),
    ]);
    setListAppoved(buildingWorksList);
  };

  /**
   * Funcionality to refresh the disapproved tab when you want to accept
   * a buildingWork again.
   */
  const disapprovedTab = async () => {
    const buildingWorks = await getAllBuildingWorks("REJECTED");
    renderRejectedBuildingWorkIds(buildingWorks);
  };

  const renderRejectedBuildingWorkIds = (buildingWorks) => {
    const buildingWorksList = getList(buildingWorks, [
      (buildingWorkId) => buttonAccept(buildingWorkId),
    ]);
    setBuildingWorksListRejected(buildingWorksList);
  };

  /**
   * Request "fetch" to obtain approved, disapproved, rejected or deleted
   * buildingWorks, depends on the "status" parameter and with error control.
   * @param {*} status String to show that you want it to see.
   * The states are: PENDING APPROVED REJECTED DELETED
   * @returns arrangement of buildingWorkly limited for page.
   */
  const getAllBuildingWorks = async (status) => {
    try {
      const buildingWorksNotAppoved = await buildingWorkService.findAll(
        status,
        pageSize.page,
        pageSize.size,
        session?.accessToken
      );
      return buildingWorksNotAppoved;
    } catch (error) {
      console.error(error);
    }
  };

  const getBuildingWorksForApproved = async (status) => {
    try {
      const buildingWorksNotApproved = await buildingWorkService.findAll(
        status,
        pageSize.page,
        pageSize.size,
        session?.accessToken
      );
      return buildingWorksNotApproved;
    } catch (error) {
      console.error(error);
    }
  };

  const getListHead = (
    <>
      <th>{t("common:image")}</th>
      <th>{t("common:name")}</th>
      <th>{t("common:date")}</th>
      <th>{t("common:professional")}</th>
      <th>{t("common:table-admin.tokens")}</th>
      <th>{t("common:table-admin.actions")}</th>
    </>
  );

  /**
   * Complete the body part of the table showing the result of the pending,
   * approved or rejected buildingWork consultations.
   * @param {*} buildingWorks these are the buildingWorks who arrive
   * from a request "fetch" from the BD
   * @param {*} buttons is the buttons you want to display in the table as actions.
   * @returns the body of the table.
   */
  const getList = (buildingWorks, buttons) => {
    const buildingWorksList = buildingWorks.map((buildingWork, index) => {
      return (
        <tr key={index} className="align-middle text-center">
          <td scope="row">{index + 1}</td>
          <td width="150px">
            <figure className="figure mx-auto">
              <img
                className="img-fluid rounded"
                src={buildingWork.previewImage}
                alt=""
              />
            </figure>
          </td>
          <td>{buildingWork.name}</td>
          <td>{buildingWork.statusUpdate}</td>
          <td>{buildingWork.professional.contact}</td>
          <td>
            <Input
              min="0"
              type="number"
              className="d-inline-block w-50 mr-2"
              defaultValue={buildingWork.tokensAsigned}
            />
            <Button
            // onClick={(e) =>
            //   setNewTokensToBuildingWork(
            //     e.target.previousElementSibling.value,
            //     buildingWork.id
            //   )
            // }
            >
              {t("apply")}
            </Button>
          </td>
          <td>
            {buttons.map((button, index) => {
              return <div key={index}>{button(buildingWork.id)}</div>;
            })}
          </td>
        </tr>
      );
    });
    return buildingWorksList;
  };

  const setNewTokensToBuildingWork = async (tokens, buildingWorkId) => {
    // await buildingWorkService.setNewTokensToBuildingWorkId(
    //   tokens,
    //   buildingWorkId,
    //   session.accessToken
    // );
    alert(t("tokens-setted"));
  };

  /**
   * This is for when using the SSR and loading the tableAdmin component properly
   * with the list of pending buildingWorks.
   */
  useEffect(async () => {
    if (buildingWorksNotApproved) {
      const buildingWorksList = getList(buildingWorksNotApproved, [
        (buildingWorkId) => buttonAccept(buildingWorkId),
        (buildingWorkId) => buttonReject(buildingWorkId),
      ]);
      setBuildingWorkListNotAppoved(buildingWorksList);
    }
  }, [buildingWorksNotApproved]);

  /**
   * This is for when using the SSR and loading the tableAdmin component properly
   * with the list of approved proffesional.
   */
  useEffect(async () => {
    if (buildingWorksApproved) {
      const buildingWorkList = getList(buildingWorksApproved, [
        (buildingWorkId) => buttonReject(buildingWorkId),
      ]);
      setListAppoved(buildingWorkList);
    }
  }, [buildingWorksApproved]);

  /**
   * This is for when using the SSR and loading the tableAdmin component properly
   * with the list of disapproved proffesional.
   */
  useEffect(async () => {
    if (buildingWorksRejected) {
      const buildingWorkList = getList(buildingWorksRejected, [
        (buildingWorkId) => buttonAccept(buildingWorkId),
      ]);
      setBuildingWorksListRejected(buildingWorkList);
    }
  }, [buildingWorksRejected]);

  /**
   * These are the titles of the tabs needed to describe each other.
   */
  const titles = [t("pending"), t("approved"), t("disapproved")];

  /**
   * Find all buildingWorks by username and status, if username is empty, only find by status
   * when get all buildingWorks, the method will render them
   */
  const findByContactAndStatus = async (username, status) => {
    let newBuildingWorks;

    if (username != "")
      newBuildingWorks = await buildingWorkService.findByContactAndStatus(
        username,
        status,
        pageSize.page,
        pageSize.size
      );
    else newBuildingWorks = await getBuildingWork(status);

    switch (status) {
      case "PENDING":
        renderPending(newBuildingWorks);
        break;
      case "APPROVED":
        renderApproved(newBuildingWorks);
        break;
      case "REJECTED":
        renderRejectedBuildingWorks(newBuildingWorks);
        break;
    }
  };

  return (
    <Layout title={t("managing-buildingWorks")}>
      <Row>
        <Col>
          <Tabs titles={titles}>
            <TableAdmin
              listHead={getListHead}
              listBody={buildingWorkListNotAppoved}
              title={titles[0]}
              onSearch={(username) =>
                findByContactAndStatus(username, "PENDING")
              }
            />
            <TableAdmin
              listHead={getListHead}
              listBody={buildingWorksListAppoved}
              title={titles[1]}
              onSearch={(username) =>
                findByContactAndStatus(username, "APPROVED")
              }
            />
            <TableAdmin
              listHead={getListHead}
              listBody={buildingWorksListRejected}
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

  let buildingWorksApproved = [];
  let buildingWorksRejected = [];
  let buildingWorksNotApproved = [];
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
    buildingWorksNotApproved = await buildingWorkService.findAll(
      status,
      page,
      size,
      token
    );

    status = "APPROVED";
    buildingWorksApproved = await buildingWorkService.findAll(status, page, size, token);
    status = "REJECTED";
    buildingWorksRejected = await buildingWorkService.findAll(status, page, size, token);
  }

  return {
    props: {
      buildingWorksNotApproved,
      buildingWorksApproved,
      buildingWorksRejected,
      session,
    },
  };
}
export default BuildingAdmin;
