import API from "./api";

export const findAll = async (page, size, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(`/projects?page=${page}&size=${size}`);
};

export const getById = async (id, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(`/projects/${id}`);
};

export const setProject = async (project, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.post(`/projects`, project);
};

export const downloadProject = async (id, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(`/projects/${id}/download`);
};