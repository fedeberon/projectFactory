import API from "./api";
import * as imageService from "./imageService";

export const create = async (name, logo, categories, token) => {
    API.defaults.headers.common["Authorization"] = token;
    const newCategories = [];
    categories.map(category => newCategories.push({"name": category.tag}));
    const companyRequest = {
        name,
        categories : newCategories
    };
    const company = await API.post(`/companies`, companyRequest);
    await imageService.uploadCompanyPreview(company.id, logo, token);
}

export const getStartsWith = async (value, page, size) => {
    return await API.get(`/companies/name/${value}?page=${page}&size=${size}`);
};

export const findAll = async ( page, size, token) => {
    API.defaults.headers.common["Authorization"] = token;
    return await API.get(`/companies?page=${page}&size=${size}`);
};
