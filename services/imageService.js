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

export const addCaroucelImages = async (images, token) => {
    API.defaults.headers.common["Authorization"] = token;
    await Promise.all(images.map(async image => {
        const imageData = new FormData();
        imageData.append('image', image);
        imageData.append('title', image.title);
        imageData.append('subTitle', image.subTitle);
        imageData.append('link', image.link);
        await API.post(`/images/carousel`, imageData);
    }));
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
        image.path = `${process.env.NEXT_PUBLIC_HOST_BACKEND}/images/professionals/${image.entity.id}/images/${image.path}`;
    });
    return images;
};

export const getProfessionalImages = async (id, page, size, token) => {
    API.defaults.headers.common["Authorization"] = token;
    const images = await API.get(`/images/professionals/${id}?page=${page}&size=${size}`);
    images.forEach( image => {
        image.name = image.path;
        image.path = `${process.env.NEXT_PUBLIC_HOST_BACKEND}/images/professionals/${id}/images/${image.path}`;
    });
    return images;
};

export const uploadCompanyPreview = async (companyId, image, token) => {
    API.defaults.headers.common["Authorization"] = token;
    const imageData = new FormData();
    imageData.append("image", image);
    await API.post(`/images/companies/${companyId}/preview`, imageData);
}

export const findCarouselImages = async () => {
    let images = await API.get(`/images/carousel`);
    images.forEach( image => {
        image.path = `${process.env.NEXT_PUBLIC_HOST_BACKEND}/images/carousel/${image.path}`;
    });
    return images;
};

export const changeStateImagesByProfessionalId = async (professionalId, approved, token) => {
    API.defaults.headers.common["Authorization"] = token;
    await API.put(`/images/professionals/${professionalId}/approved/${approved}`);
};