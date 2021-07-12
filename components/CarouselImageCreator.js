import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/client";
import { Button, Container, FormGroup, Input, Label } from "reactstrap";
import ModalForm from "./ModalForm";
import useTranslation from "next-translate/useTranslation";
import InputImages from "./InputImages/InputImages";
import * as imageService from "../services/imageService";

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
        <Button onClick={toggle}>
          {t("carousel-image-creator.add-carousel-image")}
        </Button>
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
            <Button onClick={onAddImages}>
              {t("carousel-image-creator.add-images")}
            </Button>
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
            <FormGroup>
              <Label for="input-title">
                {t("carousel-image-creator.title")}
              </Label>
              <br></br>
              <Input id="input-title" />
              <br></br>
              <Label for="input-subTitle">
                {t("carousel-image-creator.sub-title")}
              </Label>
              <br></br>
              <Input id="input-subTitle" />
              <Label for="input-link">{t("link")}</Label>
              <br></br>
              <Input id="input-link" />
            </FormGroup>

            <Button
              onClick={() => onAddTitle(currentImage)}
              color="primary mt-1"
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
