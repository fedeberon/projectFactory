import API from "./api";
import { signIn } from "next-auth/client";
import * as tagService from "./tagService";
import * as imageService from "./imageService";

export const findAll = async (page, size, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(`/professionals?page=${page}&size=${size}`);
};

export const getById = async (id, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(`/professionals/${id}`);
};

export const getByIdWithImages = async (id, page, size, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const professional = await getById(id, token);
  const images = await imageService.getProfessionalImages(
    id,
    page,
    size,
    token
  );
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
  imageData.append("imageFile", image);
  return await API.post(`/images/professionals/preview`, imageData);
};

export const addImage = async (image, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const tags = tagService.getTags(image.tags);
  const imageData = new FormData();
  imageData.append("image", image);
  imageData.append("tags", tags);
  image.uploading = true;
  return await API.post(`/images/professionals`, imageData, {
    onUploadProgress: (progressEvent) => {
      const progress = Math.round(
        (progressEvent.loaded / progressEvent.total) * 100
      );
      image.setProgress(progress);
    },
  });
};

export const addImages = async (images, token) => {
  await addImagesRecursive(Array.from(images), token);
};

const addImagesRecursive = async (images, token) => {
  const image = images.shift();
  const response = await addImage(image, token);
  if (response && images.length > 0) {
    await addImagesRecursive(images, token);
  }
};

export const addBackgroundImage = async (image, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const imageData = new FormData();
  imageData.append("imageFile", image);
  return await API.post(`/images/professionals/background`, imageData);
};

export const become = async (professional, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const response = await API.post(`/professionals/become`, professional);
  signIn("credentials", {
    accessToken: response.token,
    name: professional.contact,
    email: professional.email,
    callbackUrl: `${window.location.origin}/profile`,
  });
  return response.token;
};

export const getProfessionalForApproved = async (status, page, size, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(
    `/professionals/status/${status}?page=${page}&size=${size}`
  );
};

export const setEnebleProfessional = async (id, status, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.put(`/professionals/${id}/status/${status}`);
};
