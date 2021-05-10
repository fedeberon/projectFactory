import API from "./api";

export const getProjects = async (page, size, session) => {
  API.defaults.headers.common["Authorization"] = session.accessToken;
  return await API.get(`/projects?page=${page}&size=${size}`);
};

export const getProjectById = async (id, session) => {
  API.defaults.headers.common["Authorization"] = session.accessToken;
  return await API.get(`/projects/${id}`);
};

export const setProject = async (
  name,
  description,
  totalArea,
  year,
  website
) => {
  const data = {
    name,
    description,
    totalArea,
    year,
    website,
  };
  API.defaults.headers.common["Authorization"] = session.accessToken;
  return await API.post(`/projects`, data);
};
