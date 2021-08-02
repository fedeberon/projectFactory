//Frameworks
import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { stateToHTML } from 'draft-js-export-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import useTranslation from "next-translate/useTranslation";
import { useSession } from "next-auth/client";
import parse from 'html-react-parser'
import Link from "next/link";

//Services
import * as magazineService from "../../../services/magazineService";

//Components
import Layout from "../../../components/Layout/Layout";
import PrimaryButton from "../../../components/Buttons/PrimaryButton/PrimaryButton";

const index = () => {
  const [contentState, setContentState] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [magazineCreatedUrl, setMagazineCreatedUrl] = useState("#");
  const [session] = useSession();
  const ancorToMagazine = useRef();
  const { t } = useTranslation("magazine");
  const Editor = dynamic(
    () => {
      return import("react-draft-wysiwyg").then((mod) => mod.Editor);
    },
    { ssr: false }
  );

  useEffect(() => {
    if (magazineCreatedUrl != "#") {
      ancorToMagazine.current.click();
    }
  }, [magazineCreatedUrl]);

  const uploadImageCallBack = (file) => {
    const imageObject = {
      file: file,
      localSrc: URL.createObjectURL(file),
    };

    return new Promise((resolve, reject) => {
      resolve({ data: { link: imageObject.localSrc } });
    });
  };

  const processContent = () => {
    const contentState = editorState.getCurrentContent();
    const contentt = JSON.stringify(convertToRaw(contentState));
    const contentHTML = stateToHTML(convertFromRaw(JSON.parse(contentt)));
    return contentHTML;
  }

  const onSubmit = async () => {
    const content = processContent();
    const title = document.querySelector("#magazine-title").value;
    const description = document.querySelector("#magazine-description").value;
    const previewImage = document.querySelector("#magazine-preview-image").files[0];
    const category = document.querySelector("#magazine-category").value;
    const author = document.querySelector("#magazine-author").value;

    const magazine = {
      title,
      author,
      category,
      description,
      previewImage,
      content,
    };

    const response = await magazineService.create(magazine, session.accessToken);
    setMagazineCreatedUrl("/magazine/" + response.title.replace(/\s+/g, "-").toLowerCase() + "-" + response.id);
  };

  return (
    <Layout>
      <section className="container">
        <span>{t("magazine-title")}</span>
        <input type="text" id="magazine-title" className="d-block" />
        <span>{t("magazine-description")}</span>
        <input type="text" id="magazine-description" className="d-block" />
        <span>{t("magazine-preview-image")}</span>
        <input type="file" id="magazine-preview-image" className="d-block" />
        <span>{t("magazine-category")}</span>
        <input type="text" id="magazine-category" className="d-block" />
        <span>{t("magazine-author")}</span>
        <input type="text" id="magazine-author" className="d-block" />
        <div className="editor">
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            editorContent={contentState}
            onContentStateChange={setContentState}
            toolbar={{
              image: {
                uploadCallback: uploadImageCallBack,
                previewImage: true,
                alt: { present: true, mandatory: false },
                inputAccept:
                  "image/gif,image/jpeg,image/jpg,image/png,image/svg",
              },
            }}
          />
        </div>

        <PrimaryButton onClick={onSubmit}>
          {t("publish-magazine")}
        </PrimaryButton>

        <Link href={magazineCreatedUrl}>
          <a className="d-none" ref={ancorToMagazine}></a>
        </Link>
      </section>
    </Layout>
  );
};

export default index;
