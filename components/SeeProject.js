import React, { useState, useEffect } from 'react';
import ModalForm from "./ModalForm";
import { useTranslation } from "react-i18next";
import FormEditProject from '../components/FormEditProject';
import { useRouter } from "next/router";
import FormBuyProject from "../components/FormBuyProject"
import FormTwoFactorAuthentication from "../components/FormTwoFactorAuthentication"
import SeeProjectImages from "../components/SeeProjectImages"

const SeeProject = ({ project, onEditProject }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const { t, lang } = useTranslation("common");
    const router = useRouter();
    const { id } = router.query;

    const toggleModal = () => setModalOpen(!modalOpen);
    
    const showBuyProject = () => {
        document.querySelector("#form-buy-project").hidden = false;
        document.querySelector("#project-data").hidden = true;
    };
    
    const show2FA = () => {
        document.querySelector("#two-factor").hidden = false;
        document.querySelector("#project-data").hidden = true;
    };

    useEffect(() => {}, [project])



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
            <span>Professional name: {project.professional?.firstName}</span><br></br>
            <span>Professional last name: {project.professional?.firstName}</span><br></br>
            <span>Professional email: {project.professional?.firstName}</span><br></br>
            {!project.purchased && <button onClick={showBuyProject}>Buy project</button>}
            {project.purchased && <button onClick={show2FA}>Download project</button>}
        </div>
        <button onClick={toggleModal}>Edit</button>
        <div hidden id="form-buy-project">
            <FormBuyProject projectId={id}/>
        </div>
        <div hidden id="two-factor">
            <FormTwoFactorAuthentication projectId={id}/>
        </div>
        <div>
            <SeeProjectImages images={project.images}/>
        </div>
        <iframe width="560" height="315" src={`https://www.youtube.com/embed/${project.videoPath}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
    </>
    );
}

export default SeeProject; 