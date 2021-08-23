import React, { useState, useEffect } from "react";
import ModalForm from "../ModalForm";
import useTranslation from "next-translate/useTranslation";
import FormEditProject from "../FormEditProject";
import { useRouter } from "next/router";
import {
  Col,
  Container,
  Row,
} from "react-bootstrap";
import SeeProjectStyle from "./SeeProject.module.css";
import PrimaryButton from "../Buttons/PrimaryButton/PrimaryButton";
import CardProject from "../CardProject/CardProject";
import SwiperCarouselProject from "../Swiper/SwiperCarouselProject/SwiperCarouselProject";

const SeeProject = ({ project, onEditProject, id, onBuyProyect, downloadProject, status }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation("common");
  const router = useRouter();

  const toggleModal = () => setModalOpen(!modalOpen);

  const projectsOfProfessionalList = project?.projectsOfProfessional?.map(
    (project) => {
      return <Col key={project.id} sm={12} md={4} lg={3}><CardProject project={project}/></Col>;
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
      <div className="w-100 mb-4">
        {project.images && 
          <SwiperCarouselProject images={project.images} setCurrentImageId={()=>{}} setAppliedFilters={()=>{}}/>
        }
      </div>
      <section className="container py-2">
        <Row>
          <Col sm={12} md={4} lg={3}>
            <aside className="boxdeg">
              <div>
                <span className={SeeProjectStyle.asideTitle}>
                  {t("-name")}
                </span>
                <span>{project.name}</span>
              </div>project

              <hr />

              <div>
                <span className={SeeProjectStyle.asideTitle}>
                  {t("professional-contact")}
                </span>
                <span className="d-block">{project.professional?.contact}</span>
              </div>

              <hr />
              <div>
                <span className={SeeProjectStyle.asideTitle}>
                  {t("total-area")}
                </span>
                <span className="d-block">{project.totalArea}</span>
              </div>

              <hr />
              <div>
                <span className={SeeProjectStyle.asideTitle}>{t("year")}</span>
                <span className="d-block">{project.year}</span>
              </div>

              <hr />
              <div>
                <span className={SeeProjectStyle.asideTitle}>
                  {t("web-site")}
                </span>
                <span className="d-block">{project.website}</span>
              </div>

              <hr />
              <div>
                <Row>
                  <Col sm={12} md={6} lg={6}>
                    {!project.purchased ? (
                      <PrimaryButton className="w-100" onClick={onBuyProyect}>
                        {t("buy-project")}
                      </PrimaryButton>
                    ) : (
                      <PrimaryButton className="w-100" onClick={downloadProject}>
                        {t("download-project")}
                      </PrimaryButton>
                    )}
                  </Col>
                  <Col sm={12} md={6} lg={6}>
                    <PrimaryButton className="w-100" onClick={toggleModal}>
                      {t("project-edit")}
                    </PrimaryButton>
                  </Col>
                </Row>
              </div>

              <hr />
              <div>
                {status == "approved" && (
                  <div className="alert alert-success" role="alert">
                    {t("you-bought-this-project")}
                  </div>
                )}
              </div>
            </aside>
          </Col>

          <Col>
            <p>{project.description}</p>
            <div className={SeeProjectStyle.videoResponsive}>
              <iframe
                src={`https://www.youtube.com/embed/${project.videoPath}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Col>
        </Row>

          <div className="my-4">
            <h2 className={SeeProjectStyle.productsTitle}>
              {t("other-projects-of-professional")}
              <small>
                {t("other-projects-of-professional-description", {professional: project.professional?.contact})}
              </small>
            </h2>
          </div>
        
        <Row className="g-2">
          {projectsOfProfessionalList}
        </Row>
      </section>
    </>
  );
};

export default SeeProject;
