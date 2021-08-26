//Frameworks
import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { stateToHTML } from 'draft-js-export-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import useTranslation from "next-translate/useTranslation";
import { useSession } from "next-auth/client";
import { useForm } from "react-hook-form";
import Link from "next/link";

//Services
import * as magazineService from "../../../services/magazineService";

//Components
import Layout from "../../../components/Layout/Layout";
import PrimaryButton from "../../../components/Buttons/PrimaryButton/PrimaryButton";
import CategorySelector from "../../../components/CategorySelector/CategorySelector";
import { useSelector } from "react-redux";
import CategoryList from "../../../components/CategoryList/CategoryList";
import { Col, Form, Row } from "react-bootstrap";
import Dropzone from "../../../components/Dropzone/Dropzone";
import Error from "../../../components/Error";

const index = () => {
  const [contentState, setContentState] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [magazineCreatedUrl, setMagazineCreatedUrl] = useState("#");
  const selectedCategories = useSelector(state => state.categories.selectedCategories);
  const [previewImage, setPreviewImage] = useState([]);
  const [error, setError] = useState("");
  const [timeErrorLive, setTimeErrorLive] = useState(0);
  const [session] = useSession();
  const ancorToMagazine = useRef();
  const { t } = useTranslation("magazine");
  const Editor = dynamic(
    () => {
      return import("react-draft-wysiwyg").then((mod) => mod.Editor);
    },
    { ssr: false }
  );

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const showErrorToLimitTime = (error) => {
    setError(error);
    clearTimeout(timeErrorLive);
    setTimeErrorLive(
      setTimeout(() => {
        setError("");
      }, 3000)
    );
  };

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

    return new Promise((resolve) => {
      resolve({ data: { link: imageObject.localSrc } });
    });
  };

  const processContent = () => {
    const contentState = editorState.getCurrentContent();
    const contentt = JSON.stringify(convertToRaw(contentState));
    const contentHTML = stateToHTML(convertFromRaw(JSON.parse(contentt)));
    return contentHTML;
  }

  const hasPreviewImage = () => previewImage.length > 0;

  const hasSelectedCategory = () => selectedCategories.length > 0;

  const hasAnyError = () => {
    if (!hasPreviewImage()) {
      showErrorToLimitTime(
        t("common:is-required", {
          nameRequired: t("common:preview-image"),
        })
      );
      return true;
    }

    if (!hasSelectedCategory()) {
      showErrorToLimitTime(
        t("common:is-required", {
          nameRequired: t("common:categories"),
        })
      );
      return true;
    }

    return false;
  };

  const onSubmit = async ({ title, description, author }) => {
    const error = hasAnyError();
    if (!error && title) {
      const content = processContent();

      const magazine = {
        title,
        author,
        category: selectedCategories[0],
        description,
        previewImage: previewImage[0],
        content,
      };

      const response = await magazineService.create(magazine, session.accessToken);
      setMagazineCreatedUrl("/magazine/" + response.title.replace(/\s+/g, "-").toLowerCase() + "-" + response.id);
    }
  };

  return (
    <Layout>
      <section className="container">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col sm={12} md={6} lg={6}>
              <Form.Group>
                <Form.Label htmlFor="title">{t("magazine-title")}</Form.Label>
                <Form.Control
                  type="text"
                  id="title"
                  placeholder={`${t("common:write-the-here-please", {
                    namePlaceholder: t("common:title").toLowerCase(),
                  })}`}
                  className={
                    "form-field" + (errors.name ? " has-error" : "")
                  }
                  {...register("title", {
                    required: {
                      value: true,
                      message: `${t("common:is-required", {
                        nameRequired: t("common:title"),
                      })}`,
                    },
                    minLength: {
                      value: 3,
                      message: `${t("common:cannot-be-less-than-character", {
                        nameInput: t("common:title"),
                        numberCharacters: 3,
                      })}`,
                    },
                  })}
                />
              </Form.Group>
            </Col>

            <Col sm={12} md={6} lg={6}>
              <Form.Group>
                <Form.Label htmlFor="description">{t("magazine-description")}</Form.Label>
                <Form.Control
                  type="text"
                  id="description"
                  placeholder={`${t("common:write-the-here-please", {
                    namePlaceholder: t("common:description").toLowerCase(),
                  })}`}
                  className={
                    "form-field" + (errors.name ? " has-error" : "")
                  }
                  {...register("description", {
                    required: {
                      value: true,
                      message: `${t("common:is-required", {
                        nameRequired: t("common:description"),
                      })}`,
                    },
                    minLength: {
                      value: 3,
                      message: `${t("common:cannot-be-less-than-character", {
                        nameInput: t("common:description"),
                        numberCharacters: 3,
                      })}`,
                    },
                  })}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col sm={12} md={12} lg={12} className="mt-3">
              <Dropzone
                newFiles={previewImage}
                setFile={setPreviewImage}
                accept={"image/*"}
                multiple={false}
                name={"previewImage"}
                height={"235px"}
              />
            </Col>
          </Row>
         
          <Row className="my-4">
            <Col sm={12} md={6} lg={6}>
              <Form.Group>
                <Form.Label htmlFor="category">{t("magazine-category")}</Form.Label>
                {selectedCategories.length === 0 ? 
                  <CategorySelector typeCategory="MAGAZINE"/>
                :
                <CategoryList/>
                }
              </Form.Group>
            </Col>

            <Col sm={12} md={6} lg={6}>
              <Form.Group>
                <Form.Label htmlFor="description">{t("magazine-author")}</Form.Label>
                <Form.Control
                  type="text"
                  id="author"
                  placeholder={`${t("common:write-the-here-please", {
                    namePlaceholder: t("common:author").toLowerCase(),
                  })}`}
                  className={
                    "form-field" + (errors.name ? " has-error" : "")
                  }
                  {...register("author", {
                    required: {
                      value: true,
                      message: `${t("common:is-required", {
                        nameRequired: t("common:author"),
                      })}`,
                    },
                    minLength: {
                      value: 3,
                      message: `${t("common:cannot-be-less-than-character", {
                        nameInput: t("common:author"),
                        numberCharacters: 3,
                      })}`,
                    },
                  })}
                />
              </Form.Group>
            </Col>
          </Row>

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

          <PrimaryButton type="submit" onClick={onSubmit}>
            {t("publish-magazine")}
          </PrimaryButton>
        </Form>

        {error && (
        <Row className="mt-2">
          <Col>
            <Error error={error} />
          </Col>
        </Row>
      )}

        <Link href={magazineCreatedUrl}>
          <a className="d-none" ref={ancorToMagazine}></a>
        </Link>
      </section>
    </Layout>
  );
};

export default index;
