import { session } from "next-auth/client";
import API from "./api";
import * as tagService from './tagService';
import * as imageService from './imageService';

export const findAll = async (page, size, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const professionals = await API.get(`/professionals?page=${page}&size=${size}`);
  professionals.forEach((professional) => {
    professional.previewImage = `${process.env.NEXT_PUBLIC_HOST_BACKEND}/images/professionals/${professional.id}/preview/${professional.previewImage}`;
    professional.backgroundImage = `${process.env.NEXT_PUBLIC_HOST_BACKEND}/images/professionals/${professional.id}/background/${professional.backgroundImage}`;
  });
  return professionals;
};

export const getById = async (id, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const professional = await API.get(`/professionals/${id}`);
  professional.previewImage = `${process.env.NEXT_PUBLIC_HOST_BACKEND}/images/professionals/${id}/preview/${professional.previewImage}`;
  professional.backgroundImage = `${process.env.NEXT_PUBLIC_HOST_BACKEND}/images/professionals/${id}/background/${professional.backgroundImage}`;
  return professional;
};

export const getByIdWithImages = async (id, page, size, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const professional = await getById(id, token);
  const images = await imageService.getProfessionalImages(id, page, size, token);

  await Promise.all(images.map(async image => {
    const imageInBytes = await fetch(image.path, {
      "headers" : { "Authorization" : token }
    });
    const imageInBlob = await imageInBytes.blob();
    const imageSrc = URL.createObjectURL(imageInBlob);
    image.path = imageSrc;
  }));

  professional.images = images;
  return professional;
};

export const addProfessional = async (professional, token) => {
  professional.previewImage = null;
  professional.backgroundImage = null;
  API.defaults.headers.common["Authorization"] = token;
  return await API.post(`/professionals`, professional);
};

export const addPreviewImage = async (image, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const imageData = new FormData();
  imageData.append('imageFile', image);
  return await API.post(`/images/professionals/preview`, imageData);
};

export const addImage = async (image, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const tags = tagService.getTags(image.tags);
  const imageData = new FormData();
  imageData.append('image', image);
  imageData.append('tags', tags);
  return await API.post(`/images/professionals`, imageData);
};

export const addImages = async (images, token) => {
  images.forEach(async image => {
    await addImage(image, token);
  });
};

export const addBackgroundImage = async (image, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const imageData = new FormData();
  imageData.append('imageFile', image);
  return await API.post(`/images/professionals/background`, imageData);
};

export const become = async (professional, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const response = await API.post(`/professionals/become`, professional);
  return response.token;
};

export { addBackgroundImage, addPreviewImage, addProfessional, getById, findAll };