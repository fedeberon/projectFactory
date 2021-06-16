import API from "./api";

export const getStartsWith = async (value, page, size) => {
    return await API.get(`/companies/name/${value}?page=${page}&size=${size}`);
};

export const findAll = async ( page, size, token) => {
    API.defaults.headers.common["Authorization"] = token;
    return await API.get(`/companies?page=${page}&size=${size}`);
};
