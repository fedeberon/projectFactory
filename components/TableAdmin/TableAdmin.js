import React from "react";
import { InfoCircleFill } from "react-bootstrap-icons";
import { Alert, Table } from "reactstrap";
import { useTranslation } from "react-i18next";

const TableAdmin = ({ professionalList, title }) => {
  const { t, lang } = useTranslation("common");

  return (
    <Table hover striped>
      <thead>
        <tr className="text-center">
          <th>#</th>
          <th>{t("Image")}</th>
          <th>{t("FirstName")}</th>
          <th>{t("LastName")}</th>
          <th>{t("Email")}</th>
          <th>{t("Actions")}</th>
        </tr>
      </thead>
      <tbody>
        {professionalList.length > 0 ? (
          professionalList
        ) : (
          <tr>
            <td colSpan="6" className="p-0">
              <Alert color="primary text-center">
                <InfoCircleFill size={25} />
                {`${t("ThereAreNotMoreProfessional")} ${title.toLowerCase()}`}
              </Alert>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default TableAdmin;
