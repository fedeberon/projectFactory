import API from "./api";

export const findAll = async (page, size, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(`/projects?page=${page}&size=${size}`);
};

export const getById = async (id, session) => {
  API.defaults.headers.common["Authorization"] = session.accessToken;
  return await API.get(`/projects/${id}`);
};

export const setProject = async (project, session) => {
  
  API.defaults.headers.common["Authorization"] = session.accessToken;
  return await API.post(`/projects`, project);
};
