import API from "./api";

export const findAll = async (page, size, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(`/projects?page=${page}&size=${size}`);
};

export const getById = async (id, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const project = await API.get(`/projects/${id}`)
  project.previewImage = `${process.env.NEXT_PUBLIC_HOST_BACKEND}/images/projects/${project.id}/${project.previewImage}`;
  return project;
};

export const setProject = async (project, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.post(`/projects`, project);
};

export const download = (id, token) => {
  token = token.split(" ")[1];
  const link = document.createElement("a");
  document.body.appendChild(link);
  link.href = `${process.env.NEXT_PUBLIC_HOST_BACKEND}/projects/${id}/download?token=${token}`;
  link.setAttribute("type", "hidden");
  link.setAttribute("download", true);
  link.click();
};