import React from "react";
import { InfoCircleFill } from "react-bootstrap-icons";
import { Alert, Table } from "react-bootstrap";
import useTranslation from "next-translate/useTranslation";
import { Form } from "react-bootstrap";
import AlertCustom from "../Alert/AlertCustom";

const TableAdmin = ({ listHead, listBody, title, onSearch }) => {
  const { t, lang } = useTranslation("common");

  const handleChangeInput = async (e) => {
    await onSearch(e.target.value);
  };

  return (
    <Table hover striped responsive>
      <thead>
        <tr className="text-center">
          <th>
            <Form.Control
              type="search"
              placeholder={t("table-admin.find-by-contact")}
              onChange={handleChangeInput}
            />
          </th>
          {listHead}
        </tr>
      </thead>
      <tbody>
        {listBody.length > 0 ? (
          listBody
        ) : (
          <tr>
            <td colSpan="8" className="p-0">
              <AlertCustom themeDark className={"mt-3"}>
                <InfoCircleFill size={25} />
                {`${t(
                  "table-admin.there-are-not-more"
                )} ${title.toLowerCase()}`}
              </AlertCustom>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default TableAdmin;
