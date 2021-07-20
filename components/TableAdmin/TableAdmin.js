import React from "react";
import { InfoCircleFill } from "react-bootstrap-icons";
import { Alert, Table } from "react-bootstrap";
import useTranslation from "next-translate/useTranslation";
import { Form } from "react-bootstrap";

const TableAdmin = ({ professionalList, title, onSearch }) => {
  const { t, lang } = useTranslation("common");

  const handleChangeInput = async (e) => {
    await onSearch(e.target.value);
  };

  return (
    <Table hover striped>
      <thead>
        <tr className="text-center">
          <th>
            <Form.Control
              type="search"
              placeholder={t("table-admin.find-by-contact")}
              onChange={handleChangeInput}
            />
          </th>
          <th>{t("image")}</th>
          <th>{t("contact")}</th>
          <th>{t("company")}</th>
          <th>{t("email")}</th>
          <th>{t("table-admin.tokens")}</th>
          <th>{t("table-admin.actions")}</th>
        </tr>
      </thead>
      <tbody>
        {professionalList.length > 0 ? (
          professionalList
        ) : (
          <tr>
            <td colSpan="7" className="p-0">
              <Alert variant="primary text-center">
                <InfoCircleFill size={25} />
                {`${t(
                  "table-admin.there-are-not-more-professional"
                )} ${title.toLowerCase()}`}
              </Alert>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default TableAdmin;
