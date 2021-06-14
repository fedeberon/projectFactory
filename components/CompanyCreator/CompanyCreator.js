import React, { useState } from "react";
import { useSession } from "next-auth/client";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
} from "reactstrap";
import ModalForm from "../ModalForm";
import { useTranslation } from "react-i18next";
import * as companyService from "../../services/companyService";
import companyCreatorStyles from "./CompanyCreator.module.css";

const CompanyCreator = () => {
  const [modalCompany, setModalCompany] = useState(false);
  const [session] = useSession();
  const { t, lang } = useTranslation("common");
  const [imageSelected, setImageSelected] = useState({});
  const [imageBlob, setImageBlob] = useState(false);

  const toggle = () => setModalCompany(!modalCompany);

  const handleChangeImg = event => {
    setImageBlob(URL.createObjectURL(event.target.files[0]));
    setImageSelected(event.target.files[0]);
  };

  const onAddCompany = async () => {
    const name = document.querySelector("#input-company-name").value;
    await companyService.create(name, imageSelected, session.accessToken);
    toggle();
  };

  return (
    <>
      {session?.authorities?.includes("ROLE_ADMINISTRATOR") && (
        <button onClick={toggle}>{t("AddCompany")}</button>
      )}

      <ModalForm
        className={"Button"}
        modalTitle={t("AddCompany")}
        formBody={
          <>
            <label>{t("CompanyName")}</label>
            <input type="text" id="input-company-name"/>
            <br></br>
            <label>{t("CompanyLogo")}</label><br/>
            {imageBlob && 
              <img className={companyCreatorStyles.img} src={imageBlob}/>
            }<br/>
            <input type="file" onChange={handleChangeImg}/>
            <br></br>
            <button onClick={onAddCompany}>{t("AddCompany")}</button>
          </>
        }
        modalOpen={{ open: modalCompany, function: setModalCompany }}
      />
    </>
  );
};

export default CompanyCreator; 