import React from 'react'
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';

const Proyect = () => {
    const { t, lang } = useTranslation("common");
    return (
        <div>
            <Header lang={lang} />
            <h1>Proyect</h1>
        </div>
    )
}

export default Proyect;
