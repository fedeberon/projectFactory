import API from "./api";
import * as tagService from "./tagService";

export const findAll = async (status, page, size) => {
  // API.defaults.headers.common["Authorization"] = token;
  return await API.get(
    `/building-works/status/${status}?page=${page}&size=${size}`
  );
};

export const getByProfessionalId = async (
  professionalId,
  page,
  size,
  token
) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(
    `/building-works/professionals/${professionalId}?page=${page}&size=${size}`
  );
};

export const getAllByCompanyId = async (companyId, page, size) => {
  return await API.get(
    `/building-works/companies/${companyId}?page=${page}&size=${size}`
  );
};

export const getById = async (id) => {
  return await API.get(`/building-works/${id}`);
};

export const setNewTokensToBuildingWorkId = async (
  newTokens,
  buildingWorkId,
  token
) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.put(`/building-works/${buildingWorkId}/tokens/${newTokens}`);
};

export const addFolder = async (data, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.post(`/building-works`, data);
};

export const setFolder = async (id, data, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.put(`/building-works/${id}`, data);
};

export const removeAndAddImages = async (images, id, token) => {
  API.defaults.headers.common["Authorization"] = token;
  let newImages = [];

  for (let i = 0; i < images.length; i++) {
    let img = images[i];
    if (img.added && img.remove) {
      //es para que la imagen ya esta en la BD y la quiere borrar
      await API.delete(`/images/${img.id}/building-works/${id}`);
    } else if (!img.added) {
      //una nueva imagen no esta en la BD
      const imageData = new FormData();
      imageData.append("image", img);
      const tags = tagService.getTags(img.tags);
      imageData.append("tags", tags);
      await API.post(`/images/building-works/${id}`, imageData);
      const path = URL.createObjectURL(img);
      newImages.push({ path });
    } else if (img.added) {
      //esta en la BD no la quiere borrar pero la quiere actualizar los tags o no pueden ser los mismos
      await editTags(img, token);
      newImages.push({ path: img.path });
    }
  }
  return newImages;
};

export const findByNameAndStatus = async (name, status, page, size) => {
  return await API.get(
    `/building-works/name/${name}/status/${status}?page=${page}&size=${size}`
  );
};

export const editTags = async (image, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const imageData = new FormData();
  const tags = tagService.getTags(image.tags);
  imageData.append("tags", tags);
  return await API.put(`/images/${image.id}/building-works/tags`, imageData);
};

export const setStatus = async (id, status, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.put(`/building-works/${id}/status/${status}`);
};

export const findByContactAndStatus = async (name, status, page, size) => {
  return await API.get(
    `/building-works/name/${name}/status/${status}?page=${page}&size=${size}`
  );
};

export const getCountByProfessional = async (id) => {
  return await API.get(`/building-works/professional/${id}/count`);
};

export const getCount = async (status) => {
  return await API.get(`/building-works/status/${status}/count`);
};

export const getAllByCategoryAndStatus = async (
  status,
  arrayCategories,
  page,
  size
) => {
  if (arrayCategories.length == 0) {
    return findAll(status, page, size);
  }
  let categoriesSeparatedByCommas = "";
  let arrayNew = arrayCategories.map((category, index) => {
    return (categoriesSeparatedByCommas += `,${category}`);
  });

  categoriesSeparatedByCommas = categoriesSeparatedByCommas.substring(1);

  return await API.get(
    `/building-works/status/${status}/categories/${categoriesSeparatedByCommas}?page=${page}&size=${size}`
  );
};
