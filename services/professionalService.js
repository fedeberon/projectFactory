import API from "./api";
import { signIn } from "next-auth/client";
import * as tagService from "./tagService";
import * as imageService from "./imageService";

export const findAll = async (page, size) => {
  return await API.get(`/professionals?page=${page}&size=${size}`);
};

export const getById = async (id) => {
  return await API.get(`/professionals/${id}`);
};

export const getByIdWithImages = async (id, page, size, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const professional = await getById(id);
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

export const become = async (data, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const response = await API.post(`/professionals/become`, data);
  return response.token;
};

export const updateToken = async (token, userId) => {
  const professional = await getById(userId);
  signIn("credentials", {
    accessToken: token,
    name: professional.contact,
    email: professional.email,
    image: professional.previewImage ? professional.previewImage : "",
    callbackUrl: `${window.location.origin}/profile`,
  });
};

export const getForApproved = async (status, page, size, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(
    `/professionals/status/${status}?page=${page}&size=${size}`
  );
};

export const setEnebleProfessional = async (id, status, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.put(`/professionals/${id}/status/${status}`);
};

export const findByUsernameAndStatus = async (username, status, page, size) => {
  return await API.get(
    `/professionals/username/${username}/status/${status}?page=${page}&size=${size}`
  );
};

export const findByContactAndStatus = async (contact, status, page, size) => {
  return await API.get(
    `/professionals/contact/${contact}/status/${status}?page=${page}&size=${size}`
  );
};

export const setNewTokensToProfessional = async (
  newTokens,
  professionalId,
  token
) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.put(`/professionals/${professionalId}/tokens/${newTokens}`);
};

export const generatePreferenceForToken = async (plan, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const backUrl = {
    success: window.location.href,
    failure: window.location.href,
    pending: window.location.href,
  };
  return await API.post(`/mercadopago/plan/${plan}/create-preference`, backUrl);
};

export const getCount = async (status) => {
  return await API.get(`/professionals/status/${status}/count`);
};

export const getAllByCategoryAndStatus = async (
  status,
  arrayCategories,
  page,
  size
) => {
  if (arrayCategories.length == 0) {
    return findAll(page, size);
  }
  let categoriesSeparatedByCommas = "";
  arrayCategories.map((category, index) => {
    return (categoriesSeparatedByCommas += `,${category}`);
  });
  categoriesSeparatedByCommas = categoriesSeparatedByCommas.substring(1);
  const encoded = encodeURI(`/professionals/status/${status}/category/${categoriesSeparatedByCommas}?page=${page}&size=${size}`);
  return await API.get(encoded);
};
