import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/client";
import { Button, Container, Form } from "react-bootstrap";
import ModalForm from "./ModalForm";
import useTranslation from "next-translate/useTranslation";
import InputImages from "./InputImages/InputImages";
import * as imageService from "../services/imageService";
import PrimaryButton from "./Buttons/PrimaryButton/PrimaryButton";

const CarouselImageCreator = ({ onAddCarouselImages }) => {
  const [modalAddImages, setModalAddImages] = useState(false);
  const [modalAddTitle, setModalAddTitle] = useState(false);
  const [currentImage, setCurrentImage] = useState({});
  const [session] = useSession();
  const { t } = useTranslation("common");
  const [images, setImages] = useState([]);

  const toggle = () => setModalAddImages(!modalAddImages);

  const onAddImages = async () => {
    await imageService.addCaroucelImages(images, session.accessToken);
    await onAddCarouselImages();
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

  useEffect(() => {
    if (modalAddImages) {
    }
  }, [modalAddImages]);

  return (
    <>
      {session?.authorities?.includes("ROLE_ADMINISTRATOR") && (
        <PrimaryButton onClick={toggle}>
          {t("carousel-image-creator.add-carousel-image")}
        </PrimaryButton>
      )}

      <ModalForm
        className={"Button"}
        modalTitle={t("carousel-image-creator.add-carousel-image")}
        size={"lg"}
        formBody={
          <>
            <h6>{t("carousel-image-creator.please-select-carousel-images")}</h6>
            <label>{t("carousel-image-creator.images")}</label>
            <InputImages
              images={images}
              accept={"image/*"}
              multiple={true}
              imagesEdited={setImages}
              withTags={false}
              onAdd={showModalTitle}
            />
            <PrimaryButton onClick={onAddImages}>
              {t("carousel-image-creator.add-images")}
            </PrimaryButton>
          </>
        }
        modalOpen={{ open: modalAddImages, function: setModalAddImages }}
      />

      <ModalForm
        className={"Button"}
        modalTitle={t("add-title")}
        size={"md"}
        formBody={
          <Container fluid="sm">
            <img
              className="w-100"
              src={currentImage.preview}
              alt="image-selected"
            ></img>
            <Form.Group>
              <Form.Label htmlFor="input-title">
                {t("carousel-image-creator.title")}
              </Form.Label>
              <br></br>
              <Form.Control id="input-title" />
              <br></br>
              <Form.Label htmlFor="input-subTitle">
                {t("carousel-image-creator.sub-title")}
              </Form.Label>
              <br></br>
              <Form.Control id="input-subTitle" />
              <Form.Label htmlFor="input-link">{t("link")}</Form.Label>
              <br></br>
              <Form.Control id="input-link" />
            </Form.Group>

            <Button
              onClick={() => onAddTitle(currentImage)}
              variant="primary mt-1"
            >
              {t("add-title")}
            </Button>
          </Container>
        }
        modalOpen={{ open: modalAddTitle, function: setModalAddTitle }}
      />
    </>
  );
};

export default CarouselImageCreator;
