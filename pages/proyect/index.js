import React from 'react'
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import { useSession } from 'next-auth/client';
import { getProjects } from '../../services/projectService';

const Proyect = () => {
    const [ session, loading ] = useSession();

    const getProjects2 = async () => {
        const result = await getProjects(0,10, session);
        console.log("GET_PROJECTS_2 ---------------");
        console.log(result);
    }

    if (session) {
        console.log("SESSION_PROYECT--------");
        console.log(session);
        getProjects2();
    }

    const { t, lang } = useTranslation("common");
    return (
        <div>
            <Header lang={lang} />
            <h1>Proyect</h1>
        </div>
    )
}

export default Proyect;
