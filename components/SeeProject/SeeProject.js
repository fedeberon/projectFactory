import React, { useState, useEffect } from "react";
import ModalForm from "../ModalForm";
import useTranslation from "next-translate/useTranslation";
import FormEditProject from "../FormEditProject";
import { useRouter } from "next/router";
import FormTwoFactorAuthentication from "../FormTwoFactorAuthentication";
import {
  Form,
  Button,
  Card,
  Col,
  Container,
  Label,
  Row,
} from "react-bootstrap";
import CarouselProject from "../CarouselProject/CarouselProject";
import SeeProjectStyle from "./SeeProject.module.css";

const SeeProject = ({ project, onEditProject, id, onBuyProyect, status }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation("common");
  const router = useRouter();

  const toggleModal = () => setModalOpen(!modalOpen);

  const show2FA = () => {
    document.querySelector("#two-factor").hidden = false;
    document.querySelector("#project-data").hidden = true;
  };

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
              <Card.Body>
                <Card.Title tag="h5">{project.name}</Card.Title>
                <Card.Subtitle tag="h6" className="mb-2 text-muted">
                  <div id="project-data">
                    <Row>
                      <Col>
                        <Form.Label>{t("professional-contact")}:</Form.Label>
                        <p>{project.professional?.contact}</p>
                      </Col>
                      <Col>
                        <Form.Label>{t("total-area")}:</Form.Label>
                        <p>{project.totalArea}</p>
                      </Col>
                      <Col>
                        <Form.Label>{t("year")}:</Form.Label>
                        <p>{project.year}</p>
                      </Col>
                      <Col>
                        <Form.Label>{t("web-site")}:</Form.Label>
                        <p>{project.website}</p>
                      </Col>
                      <Col>
                        <Form.Label>{t("professional-email")}:</Form.Label>
                        <p>{project.professional?.email}</p>
                      </Col>
                    </Row>
                  </div>
                </Card.Subtitle>
                <img
                  className={`${SeeProjectStyle.img}`}
                  src={project.previewImage}
                  width="100%"
                  alt="preview-image"
                ></img>
                <Card.Text>{project.description}</Card.Text>
              </Card.Body>
            </Card>
            <Row className="my-2">
              <Col>
                {!project.purchased && (
                  <Button
                    className="mx-1"
                    variant={"success"}
                    id="btn-show-buy-project"
                    onClick={onBuyProyect}
                  >
                    {t("buy-project")}
                  </Button>
                )}
                {project.purchased && (
                  <Button variant={"primary"} id="btn-show-2FA" onClick={show2FA}>
                    {t("download-project")}
                  </Button>
                )}
                <Button
                  className="mx-1"
                  variant={"warning"}
                  onClick={toggleModal}
                >
                  {t("project-edit")}
                </Button>
              </Col>
              {status == "approved"  &&
              <div class="alert alert-success" role="alert">
                {t("you-bought-this-project")}
              </div>
              }
              <div className="cho-container"></div>
            </Row>
            <div hidden id="two-factor">
              <FormTwoFactorAuthentication projectId={id} />
            </div>
            <div className="d-flex justify-content-center align-items-center my-3">
              <Col md={"12"}>
                {project?.images?.map(image => 
                <img key={image.id} src={image.path}/>)}
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
