import React, { useState, useEffect } from "react";
import ModalForm from "../ModalForm";
import useTranslation from "next-translate/useTranslation";
import FormEditProject from "../FormEditProject";
import { useRouter } from "next/router";
import FormBuyProject from "../FormBuyProject";
import FormTwoFactorAuthentication from "../FormTwoFactorAuthentication";
import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Container,
  Label,
  Row,
} from "reactstrap";
import CarouselProject from "../CarouselProject/CarouselProject";
import SeeProjectStyle from "./SeeProject.module.css";

const SeeProject = ({ project, onEditProject, id }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation("common");
  const router = useRouter();

  const toggleModal = () => setModalOpen(!modalOpen);

  const showBuyProject = () => {
    document.querySelector("#form-buy-project").hidden = false;
    document.querySelector("#project-data").hidden = true;
  };

  const show2FA = () => {
    document.querySelector("#two-factor").hidden = false;
    document.querySelector("#project-data").hidden = true;
  };

  useEffect(() => {}, [project]);

  const projectsOfProfessionalList = project?.projectsOfProfessional?.map(
    (project) => {
      return <img key={project.previewImage} src={project.previewImage} />;
    }
  );

  return (
    <>
      <ModalForm
        size={"xl"}
        className={"Button"}
        modalTitle={t("project-edit")}
        formBody={
          <FormEditProject
            project={project}
            onEdit={onEditProject}
            toggle={toggleModal}
          />
        }
        modalOpen={{ open: modalOpen, function: setModalOpen }}
      />
      <Container>
        <Row>
          <Col>
            <Card>
              <CardBody>
                <CardTitle tag="h5">{project.name}</CardTitle>
                <CardSubtitle tag="h6" className="mb-2 text-muted">
                  <div id="project-data">
                    <Row>
                      <Col>
                        <Label>{t("professional-contact")}:</Label>
                        <p>{project.professional?.contact}</p>
                      </Col>
                      <Col>
                        <Label>{t("total-area")}:</Label>
                        <p>{project.totalArea}</p>
                      </Col>
                      <Col>
                        <Label>{t("year")}:</Label>
                        <p>{project.year}</p>
                      </Col>
                      <Col>
                        <Label>{t("web-site")}:</Label>
                        <p>{project.website}</p>
                      </Col>
                      <Col>
                        <Label>{t("professional-email")}:</Label>
                        <p>{project.professional?.email}</p>
                      </Col>
                    </Row>
                  </div>
                </CardSubtitle>
                <img
                  className={`${SeeProjectStyle.img}`}
                  src={project.previewImage}
                  width="100%"
                  alt="preview-image"
                ></img>
                <CardText>{project.description}</CardText>
              </CardBody>
            </Card>
            <Row className="my-2">
              <Col>
                {!project.purchased && (
                  <Button
                    className="mx-1"
                    color={"success"}
                    id="btn-show-buy-project"
                    onClick={showBuyProject}
                  >
                    {t("buy-project")}
                  </Button>
                )}
                {project.purchased && (
                  <Button color={"primary"} id="btn-show-2FA" onClick={show2FA}>
                    {t("download-project")}
                  </Button>
                )}
                <Button
                  className="mx-1"
                  color={"warning"}
                  onClick={toggleModal}
                >
                  {t("project-edit")}
                </Button>
              </Col>
            </Row>
            <div hidden id="form-buy-project">
              <FormBuyProject projectId={id} />
            </div>
            <div hidden id="two-factor">
              <FormTwoFactorAuthentication projectId={id} />
            </div>
            <div className="d-flex justify-content-center align-items-center my-3">
              <Col md={"12"}>
                <CarouselProject className="w-auto" images={project.images} />
              </Col>
            </div>
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${project.videoPath}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <h4>{t("other-projects-of-professional")}</h4>
            {projectsOfProfessionalList}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SeeProject;
