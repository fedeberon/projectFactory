import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import FormBuyProject from "../components/FormBuyProject";
import FormTwoFactorAuthentication from "../components/FormTwoFactorAuthentication";
import SeeProjectImages from "../components/SeeProjectImages";


const SeeProject = ({ getProject }) => {
    const router = useRouter();
    const { id } = router.query;
    const [project, setProject] = useState({});
    const [professional, setProfessional] = useState({});
    const [session, loading] = useSession();
    
    useEffect(() => {
        const fetchData = async () => {
            const project = await getProject(id);
            setProfessional(project.professional)
            setProject(project);
        }

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
        

        if (id != undefined && session != undefined) {
            fetchData();
            window.Mercadopago.setPublishableKey("TEST-28b1a53c-2241-4f9d-b262-b6ebfa87984e");
            window.Mercadopago.getIdentificationTypes();
            asignEvents();
        }
        
    }, [router,session])
    


    return(
    <>
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
        <div hidden id="form-buy-project">
            <FormBuyProject projectId={id}/>
        </div>
        <div hidden id="two-factor">
            <FormTwoFactorAuthentication projectId={id}/>
        </div>
        <div>
            <SeeProjectImages projectId={id}/>
        </div>
    </>
    );
}

export default SeeProject;