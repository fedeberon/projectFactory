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
import ModalForm from "./ModalForm";
import { useTranslation } from "react-i18next";
import * as tagService from "../services/tagService";

const TagCreator = ({ tags, setTags }) => {
  const [modalTag, setModalTag] = useState(false);
  const [session] = useSession();
  const { t, lang } = useTranslation("common");

  const toggle = () => setModalTag(!modalTag);

  const onAddTag = async () => {
    const tag = {
        "tag" : document.querySelector("#input-tag").value
    };

    const newTag = await tagService.addTag(tag, session.accessToken);
    const newTags = Array.from(tags);
    newTags.push(newTag);
    setTags(newTags);
    toggle();
  };

  return (
    <>
      {session?.authorities?.includes("ROLE_ADMINISTRATOR") && (
        <button onClick={toggle}>{t("AddTag")}</button>
      )}

      <ModalForm
        className={"Button"}
        modalTitle={t("AddTag")}
        formBody={
          <>
            <label>{t("AddTag")}</label>
            <br></br>
            <input id="input-tag"/>
            <br></br>
            <button onClick={onAddTag}>{t("AddTag")}</button>
          </>
        }
        modalOpen={{ open: modalTag, function: setModalTag }}
      />
    </>
  );
};

export default TagCreator;