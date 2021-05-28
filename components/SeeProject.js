import React, { useState, useEffect } from "react";
import ModalForm from "./ModalForm";
import { useTranslation } from "react-i18next";
import FormEditProject from "../components/FormEditProject";
import { useRouter } from "next/router";
import FormBuyProject from "../components/FormBuyProject";
import FormTwoFactorAuthentication from "../components/FormTwoFactorAuthentication";
import SeeProjectImages from "../components/SeeProjectImages";
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

const SeeProject = ({ project, onEditProject }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { t, lang } = useTranslation("common");
  const router = useRouter();
  const { id } = router.query;

  const toggleModal = () => setModalOpen(!modalOpen);

  const asignEvents = () => {
    const btnShowBuyProject = document.querySelector("#btn-show-buy-project");
    const btnDownloadProject = document.querySelector("#btn-show-2FA");
    const div2FA = document.querySelector("#two-factor");
    const formBuyProject = document.querySelector("#form-buy-project");
    const projectData = document.querySelector("#project-data");

    const showBuyProject = () => {
      formBuyProject.hidden = false;
      projectData.hidden = true;
    };

    const show2FA = () => {
      div2FA.hidden = false;
      projectData.hidden = true;
    };

    btnShowBuyProject.addEventListener("click", showBuyProject);
    btnDownloadProject.addEventListener("click", show2FA);
  };

  useEffect(() => {
    asignEvents();
    console.log("useEffect-----",project);
  }, [project]);

  return (
    <>
      <ModalForm
        className={"Button"}
        modalTitle={t("Edit project")}
        formBody={<FormEditProject project={project} onEdit={onEditProject} toggle={toggleModal} />}
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
                        <Label>Professional name:</Label>
                        <p>{project.professional?.firstName}</p>
                      </Col>
                      <Col>
                        <Label>total area:</Label>
                        <p>{project.totalArea}</p>
                      </Col>
                      <Col>
                        <Label>year:</Label>
                        <p>{project.year}</p>
                      </Col>
                      <Col>
                        <Label>website:</Label>
                        <p>{project.website}</p>
                      </Col>
                      <Col>
                        <Label>Professional last name: </Label>
                        <p>{project.professional?.firstName}</p>
                      </Col>
                      <Col>
                        <Label>Professional email:</Label>
                        <p>{project.professional?.firstName}</p>
                      </Col>
                    </Row>
                  </div>
                </CardSubtitle>
                <img
                  src={project.previewImage}
                  width="100%"
                  alt="preview-image"
                ></img>
                <CardText>{project.description}</CardText>
              </CardBody>
            </Card>
            <Row className="my-2">
              <Col>
                <Button className="mx-1" color={"success"} id="btn-show-buy-project">
                  Buy project
                </Button>
                <Button color={"primary"} id="btn-show-2FA">
                  Download project
                </Button>
                <Button className="mx-1" color={"warning"} onClick={toggleModal}>
                  Edit
                </Button>
              </Col>
            </Row>
            <div hidden id="form-buy-project">
              <FormBuyProject projectId={id} />
            </div>
            <div hidden id="two-factor">
              <FormTwoFactorAuthentication projectId={id} />
            </div>
            <div>
              <SeeProjectImages images={project.images} />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SeeProject;