import React, { useState } from "react";
import { useSession } from "next-auth/client";
import { Button, Col, Row } from "react-bootstrap";
import ModalForm from "./ModalForm";
import useTranslation from "next-translate/useTranslation";
import * as tagService from "../services/tagService";
import Error from "../components/Error";

const TagCreator = ({ tags, setTags }) => {
  const [modalTag, setModalTag] = useState(false);
  const [session] = useSession();
  const { t } = useTranslation("common");
  const [error, setError] = useState("");
  const [timeErrorLive, setTimeErrorLive] = useState(0);

  const toggle = () => setModalTag(!modalTag);

  const showErrorToLimitTime = (error) => {
    setError(error);
    clearTimeout(timeErrorLive);
    setTimeErrorLive(
      setTimeout(() => {
        setError("");
      }, 3000)
    );
  };

  const isEqual = (tag) => {
    for (const elem of tags) {
      if (elem.tag === tag.tag.toLowerCase()) {
        return true;
      }
    }
    return false;
  };

  const onAddTag = async () => {
    const tag = {
      tag: document.querySelector("#input-tag").value.toLowerCase().trim(),
    };

    if (tag.tag != "") {
      if (!isEqual(tag)) {
        const newTag = await tagService.addTag(tag, session.accessToken);
        const newTags = Array.from(tags);
        newTags.push(newTag);
        setTags(newTags);
        toggle();
      } else {
        showErrorToLimitTime(
          t("company-creator.already-exists", {
            fieldName: t("the-tag"),
          })
        );
      }
    } else {
      showErrorToLimitTime(
        t("company-creator.cannot-be-empty", {
          fieldName: t("the-tag"),
        })
      );
    }
  };

  return (
    <>
      {session?.authorities?.includes("ROLE_ADMINISTRATOR") && (
        <Button onClick={toggle}>{t("tag-creator.add-tag")}</Button>
      )}

      <ModalForm
        className={"Button"}
        size={"md"}
        modalTitle={t("tag-creator.add-tag")}
        formBody={
          <>
            <h6>{t("tag-creator.please-select-tag")}</h6>
            <label>{t("tag-creator.add-tag")}</label>
            <br></br>
            <input id="input-tag" />
            <br></br>
            <Button className="my-3" onClick={onAddTag}>
              {t("tag-creator.add-tag")}
            </Button>
            {error && (
              <Row className="mt-2">
                <Col>
                  <Error error={error} />
                </Col>
              </Row>
            )}
          </>
        }
        modalOpen={{ open: modalTag, function: setModalTag }}
      />
    </>
  );
};

export default TagCreator;
