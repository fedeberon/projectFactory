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
import TagList from "../TagList/TagList";

const CompanyCreator = () => {
  const [modalCompany, setModalCompany] = useState(false);
  const [session] = useSession();
  const { t, lang } = useTranslation("common");
  const [imageSelected, setImageSelected] = useState({});
  const [imageBlob, setImageBlob] = useState(false);
  const [tagsCategories, setTagsCategories] = useState([]);

  const removeTagCategory = (tagCategory) => {
    const newTagsCategories = Array.from(tagsCategories);
    const index = newTagsCategories.indexOf(tagCategory);
    if (index > -1) {
      newTagsCategories.splice(index, 1);
      setTagsCategories(newTagsCategories);
    }
  };

  
  const toggle = () => setModalCompany(!modalCompany);

  const handleChangeImg = event => {
    setImageBlob(URL.createObjectURL(event.target.files[0]));
    setImageSelected(event.target.files[0]);
  };

  const onAddCompany = async () => {
    const name = document.querySelector("#input-company-name").value;
    await companyService.create(name, imageSelected, tagsCategories, session.accessToken);
    toggle();
  };

  const AddCategory = () => {
    const category = document.querySelector("#category").value;
    const parse = {"tag" : category};
    const newTagsCategories = Array.from(tagsCategories);
    newTagsCategories.push(parse);
    setTagsCategories(newTagsCategories);
  }


  return (
    <>
      {session?.authorities?.includes("ROLE_ADMINISTRATOR") && (
        <Button onClick={toggle}>{t("AddCompany")}</Button>
      )}

      <ModalForm
        className={"Button"}
        modalTitle={t("AddCompany")}
        formBody={
          <>
            <label htmlFor="input-company-name">{t("CompanyName")}</label><br/>
            <input type="text" id="input-company-name"/>
            <br></br>
            {imageBlob && 
              <img className={companyCreatorStyles.img} src={imageBlob}/>
            }<br/>
            <label>{t("SelectCategoriesPlease")}</label><br/>

            <input type="text" id="category"/><Button className="mx-4" onClick={AddCategory}>{t("AddCategory")}</Button>

            <div className="my-3">
              <TagList tags={tagsCategories} onDeleteTag={removeTagCategory} />
            </div>
            <label htmlFor="logo">{t("SelectLogo")}</label><br/>
            <input type="file" id="logo" onChange={handleChangeImg}/>
            <br></br>
            <div className="my-4">
              <Button onClick={onAddCompany}>{t("AddCompany")}</Button>
            </div>
          </>
        }
        modalOpen={{ open: modalCompany, function: setModalCompany }}
      />
    </>
  );
};

export default CompanyCreator; 