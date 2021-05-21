import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import { getImages } from '../services/imageService.js';

const SeeProjectImages = ({ projectId }) => {
    const router = useRouter();
    const { id } = router.query;
    const [images, setImages] = useState([]);
    const [session, loading] = useSession();
    const [isLoading, setLoading] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const images = await getImages(projectId,session.accessToken,0,5);
            setImages(images);
            setLoading(false);
        }

        if (id != undefined && session != undefined) {
            fetchData();
        }
        
    }, [router,session])

    return(
    <>
        {isLoading ? (
        <h1>{t("Loading")}...</h1>
      ) : (
        images.map((image,index) => (
            <img key={index} src={image.path}></img>
        )
      ))}
    </>
    );
}

export default SeeProjectImages;