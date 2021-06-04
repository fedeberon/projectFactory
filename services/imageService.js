import API from "./api";

export const getImages = async (id, token,page,size) => {
    API.defaults.headers.common["Authorization"] = token;
    let images = await API.get(`/images/projects/${id}?page=${page}&size=${size}`);
    images.forEach( (image) =>{
        image.name = image.path;
        image.path = `${process.env.NEXT_PUBLIC_HOST_BACKEND}/images/projects/${id}/images/${image.path}`;
    });
    return images;
};