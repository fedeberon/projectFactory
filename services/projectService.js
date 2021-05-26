import API from "./api";

export const findAll = async (page, size, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(`/projects?page=${page}&size=${size}`);
};

export const getById = async (id, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const project = await API.get(`/projects/${id}`)
  project.previewImage = `${process.env.NEXT_PUBLIC_HOST_BACKEND}/images/${project.previewImage}`;
  return project;
};

export const addProject = async (project, token, id) => {
  project.previewImage = null;
  project.images = null;
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

export const edit = async (project, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const id = project.id;
  const previewImage = project.previewImage;
  let images;
  if (project.images) {
    images = Array.from(project.images);
  }
  
  project.previewImage = null;
  project.id = null;
  project.images = null;
  const projectEdited = await API.put(`/projects/${id}`, project);

  if (previewImage) {
    await addPreviewImage(previewImage, id, token);
  }

  if (images) {
    await addImages(images, id, token);
  }
  
  projectEdited.images = images;
  projectEdited.previewImage = previewImage;
  return projectEdited;
};