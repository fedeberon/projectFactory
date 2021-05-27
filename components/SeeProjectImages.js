import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import { getImages } from '../services/imageService.js';
import { useTranslation } from "react-i18next";

const SeeProjectImages = ({ images }) => {
    useEffect(() => {
    }, [images])

    return(
    <>
        {images?.map((image,index) => (
            <img key={index} src={image.path}></img>
        ))}
    </>
    );
}

export default SeeProjectImages;