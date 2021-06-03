import API from "./api";
import * as tagService from './tagService';

export const findAll = async (page, size, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const professionals = await API.get(`/professionals?page=${page}&size=${size}`);
  professionals.forEach((professional) => {
    professional.previewImage = `${process.env.NEXT_PUBLIC_HOST_BACKEND}/images/professionals/${professional.id}/${professional.previewImage}`;
    professional.backgroundImage = `${process.env.NEXT_PUBLIC_HOST_BACKEND}/images/professionals/${professional.id}/${professional.backgroundImage}`;
  });
  return professionals;
};

export const getById = async (id, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(`/professionals/${id}`);
};

export const addProfessional = async (professional, token) => {
  professional.previewImage = null;
  professional.backgroundImage = null;
  API.defaults.headers.common["Authorization"] = token;
  return await API.post(`/professionals`, professional);
};

export const addPreviewImage = async (image, professionalId, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const imageData = new FormData();
  imageData.append('imageFile', image);
  imageData.append('professional',professionalId);
  return await API.post(`/images/professional/preview`, imageData);
};

export const addImage = async (image, professionalId, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const tags = tagService.getTags(image.tags);
  const imageData = new FormData();
  imageData.append('image', image);
  imageData.append('tags', tags);
  return await API.post(`/images/professionals/${professionalId}`, imageData);
};

export const addImages = async (images, professionalId, token) => {
  images.forEach(async image => {
    await addImage(image, professionalId, token);
  });
};

export const addBackgroundImage = async (image, professionalId, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const imageData = new FormData();
  imageData.append('imageFile', image);
  imageData.append('professional',professionalId);
  return await API.post(`/images/professional/background`, imageData);
};
