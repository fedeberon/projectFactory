import API from "./api";

export const getImages = async (id, token,page,size) => {
    API.defaults.headers.common["Authorization"] = token;
    let images = await API.get(`/images/projects/${id}?page=${page}&size=${size}`);
    for (let i = 0; i < images.length; i++) {
        images[i].path = `${process.env.NEXT_PUBLIC_HOST_BACKEND}/images/${images[i].path}`;
    }
    return images;
};