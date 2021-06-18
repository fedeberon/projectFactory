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
import InputImages from "./InputImages/InputImages";
import * as imageService from "../services/imageService";

const CarouselImageCreator = () => {
  const [modalAddImages, setModalAddImages] = useState(false);
  const [modalAddTitle, setModalAddTitle] = useState(false);
  const [currentImage, setCurrentImage] = useState({});
  const [session] = useSession();
  const { t, lang } = useTranslation("common");
  const [images, setImages] = useState([]);

  const toggle = () => setModalAddImages(!modalAddImages);

  const onAddImages = async () => {
    await imageService.addCaroucelImages(images, session.accessToken);
    setModalAddImages(false);
  };

  const showModalTitle = (image) => {
    setModalAddTitle(true);
    setCurrentImage(image);
  };

  const onAddTitle = (image) => {
    image.title = document.querySelector("#input-title").value;
    image.subTitle = document.querySelector("#input-subTitle").value;
    image.link = document.querySelector("#input-link").value;
    
    setModalAddTitle(false);
  };

  return (
    <>
      {session?.authorities?.includes("ROLE_ADMINISTRATOR") && (
        <Button onClick={toggle}>{t("AddCarouselImage")}</Button>
      )}

      <ModalForm
        className={"Button"}
        modalTitle={t("AddCarouselImage")}
        formBody={
          <>
            <h6>{t("PleaseSelectCarouselImages")}</h6>
            <label>{t("Images")}</label>
            <InputImages
              accept={"image/*"}
              multiple={true}
              imagesEdited={setImages}
              withTags={false}
              onAdd={showModalTitle}
            />
            <Button onClick={onAddImages}>{t("AddImages")}</Button>
          </>
        }
        modalOpen={{ open: modalAddImages, function: setModalAddImages }}
      />

      <ModalForm
        className={"Button"}
        modalTitle={t("AddTitle")}
        formBody={
          <Container fluid="sm">
            <img
              className="w-100"
              src={currentImage.preview}
              alt="image-selected"
            ></img>
            <FormGroup>
              <Label for="input-title">{t("Title")}</Label>
              <br></br>
              <Input id="input-title" />
              <br></br>
              <Label for="input-subTitle">{t("SubTitle")}</Label>
              <br></br>
              <Input id="input-subTitle" />
              <Label for="input-link">{t("Link")}</Label>
              <br></br>
              <Input id="input-link" />
            </FormGroup>

            <Button
              onClick={() => onAddTitle(currentImage)}
              color="primary mt-1"
            >
              {t("AddTitle")}
            </Button>
          </Container>
        }
        modalOpen={{ open: modalAddTitle, function: setModalAddTitle }}
      />
    </>
  );
};

export default CarouselImageCreator;
