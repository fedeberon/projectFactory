import React, { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import styles from "./BuildingWork.module.css";
import { Camera } from "react-bootstrap-icons";

const BuildingWork = (props) => {
    const { buildingWork } = props;
    const { t } = useTranslation("common");

    return (
    <div className={`${styles.divCard} card`}>
        <img
        className="card-img-top"
        src={buildingWork.previewImage}
        alt="preview"
        />

        <div className="card-body d-flex">
            <div className="w-75 d-flex align-items-center">
                <h5 className="card-title">{buildingWork.name}</h5>
            </div>
            <div className="w-25 d-flex flex-column align-items-center">
                <Camera size={20} className=""/>
                <span>{buildingWork.countImages} {t("photos")}</span>
            </div>
        </div>
    </div>
    )};

export default BuildingWork;