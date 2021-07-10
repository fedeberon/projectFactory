import API from "./api";
import * as youtubeService from '../services/youtubeService';
import * as tagService from './tagService';

export const findAll = async (page, size, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return  await API.get(`/projects?page=${page}&size=${size}`);
};


export const getById = async (id, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const project = await API.get(`/projects/${id}`);
  let purchased = await isPurchased(project, token);
  project.purchased = purchased != undefined; 
  return project;
};

export const addProject = async (project, id, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const copyProject = Object.assign({}, project);
  delete copyProject.previewImage;
  delete copyProject.images;
  delete copyProject.file;
  try {
    copyProject.videoPath = youtubeService.getIdVideo(project.videoPath);
  } catch (err) {
    throw new Error(`Error, link to video invalid: ${err}`);
  }

  const projectUploaded = await API.post(`/projects?professional=${id}`, copyProject);
  
  if (project.previewImage) {
    await addPreviewImage(project.previewImage, projectUploaded.id, token);
    projectUploaded.previewImage = URL.createObjectURL(project.previewImage);
  }
  
  if (project.images.length > 0) {
    await addImages(project.images, projectUploaded.id, token);
  }
    
  if (project.file)
    await addFile(project.file, projectUploaded.id, token);
    
  return projectUploaded;
};

export const addPreviewImage = async (image, projectId, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const imageData = new FormData();
  imageData.append("imageFile", image);
  return await API.post(`/images/projects/${projectId}/preview`, imageData);
};

export const addImages = async (images, projectId, token) => {
  await addImagesRecursive(Array.from(images), projectId, token);
};

export const addImagesRecursive = async (images, projectId, token) => {
  const image = images.shift();
  const response = await addImage(image, projectId, token);
  if (response && images.length > 0) {
    await addImagesRecursive(images, projectId, token);
  }
};

export const addImage = async (image, projectId, token) => {
  const imageData = new FormData();
  const tags = tagService.getTags(image.tags);
  imageData.append("imageFile", image);
  imageData.append("tags", tags);
  image.uploading = true;
  return await API.post(`/images/projects/${projectId}`, imageData, {
    onUploadProgress: progressEvent => {
      const progress = Math.round(progressEvent.loaded / progressEvent.total * 100);
      image.setProgress(progress);
    }
  });
};

export const edit = async (project, token) => {
  API.defaults.headers.common["Authorization"] = token;
  project.videoPath = youtubeService.getIdVideo(project.videoPath);
  const id = project.id;
  const previewImage = project.previewImage;
  const images = Array.from(project.imagesEdited);
  
  delete project.previewImage;
  delete project.id;
  delete project.images;
  let projectEdited = await API.put(`/projects/${id}`, project);
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
      imageData.append("tags", []);
      await API.post(`/images/projects/${id}`, imageData);
      const path = URL.createObjectURL(img);
      newImages.push({ path });
    } else if (img.added) {
      await editTags(img, token);
      newImages.push({ path: img.path });
    }
  };
  return newImages;
};

export const editTags = async (image, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const imageData = new FormData();
  const tags = tagService.getTags(image.tags);
  imageData.append("tags", tags);
  return await API.put(`/images/${image.id}/projects/tags`, imageData);
};

export const getPurchasedProjects = async (token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(`/projects/purchased?page=0&size=99`);
};

export const isPurchased = async (project, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const purchasedProjects = await getPurchasedProjects(token);
  return purchasedProjects.find(purchased => purchased.id == project.id);
};

export const findAllByProfessionalId = async (professionalId, page, size, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(`/projects/professionals/${professionalId}?page=${page}&size=${size}`);
  
};

export const findByNameAndActive = async (name, active, page, size) => {
  return await API.get(`/projects/name/${name}/active/${active}?page=${page}&size=${size}`);
}