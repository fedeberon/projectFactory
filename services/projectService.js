import API from "./api";

export const findAll = async (page, size, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(`/projects?page=${page}&size=${size}`);
};

export const getById = async (id, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(`/projects/${id}`);
};

export const setProject = async (project, token, id) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.post(`/projects?professional=${id}`, project);
};

export const addPreviewImage = async (image, projectId, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const imageData = new FormData();
  imageData.append('imageFile', image);
  imageData.append('project',projectId);
  return await API.post(`/images/project/preview`, imageData);
};

export const addImages = async (images, projectId, token) => {
  API.defaults.headers.common["Authorization"] = token;

  images.forEach( async (image) => {
    const imageData = new FormData();
    imageData.append('imageFile', image);
    imageData.append('project',projectId);
    imageData.append('tags',[]);
    await API.post(`/images`, imageData);
  });
};
