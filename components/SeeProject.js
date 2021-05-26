import React, { useState, useEffect } from 'react';
import ModalForm from "./ModalForm";
import { useTranslation } from "react-i18next";
import FormEditProject from '../components/FormEditProject';


const SeeProject = ({ project, professional, onEditProject }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const { t, lang } = useTranslation("common");

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
    }

    useEffect(() => {
        asignEvents();
    }, [])



    return(
    <>
        <ModalForm
            className={"Button"}
            modalTitle={t("Edit project")}
            formBody={(<FormEditProject project={project} onEdit={onEditProject} />)}
            modalOpen={{"open" : modalOpen,"function":setModalOpen}}
        />
        <img src={project.previewImage} alt="preview-image"></img>
        <div id="project-data">
            <span>name: {project.name}</span> <br></br>
            <span>description: {project.description}</span><br></br>
            <span>total area: {project.totalArea}</span><br></br>
            <span>year: {project.year}</span><br></br>
            <span>website: {project.website}</span><br></br>
            <span>Professional name: {professional.firstName}</span><br></br>
            <span>Professional last name: {professional.firstName}</span><br></br>
            <span>Professional email: {professional.firstName}</span><br></br>
            <button id="btn-show-buy-project">Buy project</button><button id="btn-show-2FA">Download project</button>
        </div>
        <button onClick={toggleModal}>Edit</button>
    </>
    );
}

export default SeeProject; 