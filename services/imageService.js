import API from "./api";

export const getProjectImages = async (id, token,page,size) => {
    API.defaults.headers.common["Authorization"] = token;
    let images = await API.get(`/images/projects/${id}?page=${page}&size=${size}`);
    images.forEach( (image) =>{
        image.name = image.path;
        image.path = `${process.env.NEXT_PUBLIC_HOST_BACKEND}/images/projects/${id}/images/${image.path}`;
    });
    return images;
};

export const getProjectsImagesFiltered = async (token, page,size) => {
    API.defaults.headers.common["Authorization"] = token;
    let images = await API.get(`/images/projects/${id}?page=${page}&size=${size}`);
    images.forEach( (image) =>{
        image.name = image.path;
        image.path = `${process.env.NEXT_PUBLIC_HOST_BACKEND}/images/projects/${id}/${image.path}`;
    });
    return images;
};

export const getProfessionalImagesByTags = async (tags, page, size, token) => {
    API.defaults.headers.common["Authorization"] = token;
    let concatenatedTags = "";
    tags.forEach(tag => {
        concatenatedTags = `${concatenatedTags}tags=${tag.tag}&`;
    });
    concatenatedTags = concatenatedTags.substring(0, concatenatedTags.length - 1);

    const images = await API.get(`/images/professionals/tags?page=${page}&size=${size}&${concatenatedTags}`);
    images.forEach( (image) =>{
        image.name = image.path;
        image.path = `${process.env.NEXT_PUBLIC_HOST_BACKEND}/images/professionals/${image.entityId}/images/${image.path}`;
    });
    return images;
};