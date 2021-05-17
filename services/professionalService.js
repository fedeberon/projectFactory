import API from "./api";

export const findAll = async (page, size, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(`/professionals?page=${page}&size=${size}`);
};

export const getById = async (id, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(`/professionals/${id}`);
};

export const setProfessional = async (professional, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.post(`/professionals`, professional);
};