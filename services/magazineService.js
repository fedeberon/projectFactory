import API from "./api";
import * as imageService from "./imageService";

export const findAllCategories = async (page, size) => {
    return await API.get(`/magazines/categories?page=${page}&size=${size}`);
};

export const findAll = async (status, page, size) => {
    return await API.get(`/magazines/status/${status}?page=${page}&size=${size}`);
};

export const findAllByCategory = async (category, status, page, size) => {
    return await API.get(`/magazines/category/${category}/status/${status}?page=${page}&size=${size}`);
};

export const getById = async (id) => {
    return await API.get(`/magazines/${id}`);
};

export const create = async (data, token) => {
    API.defaults.headers.common["Authorization"] = token;
    const previewImage = data.previewImage;
    let content = data.content;
    delete data.previewImage;
    data.content = "";

    const magazine = await API.post(`/magazines`, data);
    delete magazine.datePublished;
    imageService.uploadMagazinePreview(magazine.id, previewImage, token);
    magazine.content = await imageService.uploadLocalImagesFromContent(content, magazine.id, token);
    await API.put(`/magazines/${magazine.id}`, magazine);
    await API.put(`/magazines/${magazine.id}/status/APPROVED`);
    return magazine;
};