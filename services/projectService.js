import API from "./api";

export const findAll = async (page, size, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const projects = await API.get(`/projects?page=${page}&size=${size}`);
  projects.forEach((project) => {
    project.previewImage = `${process.env.NEXT_PUBLIC_HOST_BACKEND}/images/projects/${project.id}/${project.previewImage}`;
  });
  return projects;
};

export const getById = async (id, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const project = await API.get(`/projects/${id}`);
  project.previewImage = `${process.env.NEXT_PUBLIC_HOST_BACKEND}/images/projects/${project.id}/${project.previewImage}`;
  return project;
};

export const addProject = async (project, token, id) => {
  project.previewImage = null;
  project.images = null;
  project.files = null;
  API.defaults.headers.common["Authorization"] = token;
  return await API.post(`/projects?professional=${id}`, project);
};

export const addPreviewImage = async (image, projectId, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const imageData = new FormData();
  imageData.append("imageFile", image);
  imageData.append("project", projectId);
  return await API.post(`/images/project/preview`, imageData);
};

export const addImages = async (images, projectId, token) => {
  API.defaults.headers.common["Authorization"] = token;

  images.forEach(async (image) => {
    const imageData = new FormData();
    imageData.append("imageFile", image);
    imageData.append("project", projectId);
    imageData.append("tags", []);
    await API.post(`/images`, imageData);
  });
};

export const edit = async (project, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const id = project.id;
  const previewImage = project.previewImage;
  const images = Array.from(project.imagesEdited);

  delete project.previewImage;
  delete project.id;
  delete project.images;
  let projectEdited = await API.put(`/projects/${id}`, project);
  projectEdited.previewImage = `${process.env.NEXT_PUBLIC_HOST_BACKEND}/images/projects/${id}/${projectEdited.previewImage}`;
  if (previewImage) {
    await addPreviewImage(previewImage, id, token);
    projectEdited.previewImage = URL.createObjectURL(previewImage);
  }
  
  if (images) {
    const newImages = await removeAndAddImages(images, id, token);
    projectEdited.images = newImages;
  }
  return projectEdited;
};

export const addFile = async (file, projectId, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const fileData = new FormData();
  fileData.append("file", file);
  return await API.post(`/projects/${projectId}/upload`, fileData);
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

const removeAndAddImages = async (images, id, token) => {
  API.defaults.headers.common["Authorization"] = token;
  let newImages = [];
  
  for (let i = 0; i < images.length; i++) {
    let img = images[i];
    if (img.added && img.remove) {
      await API.delete(`/images/projects/${id}/${img.name}`);
    } else if (!img.added) {
      const imageData = new FormData();
      imageData.append("imageFile", img);
      imageData.append("project", id);
      imageData.append("tags", []);
      await API.post(`/images`, imageData);
      const path = URL.createObjectURL(img);
      newImages.push({ path });
    } else {
      newImages.push({ path: img.path });
    }
  };
  return newImages;
};
