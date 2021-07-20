import API from "./api";
import * as imageService from "./imageService";

export const create = async (data, logo, backgroundImage, categories, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const newCategories = [];
  categories.map((category) => newCategories.push({ name: category.tag }));
  const companyRequest = {
    name: data.name,
    categories: newCategories,
    email: data.email,
    contact: data.contact,
    contactLoad: data.contactLoad,
    website: data.website,
    province: data.province,
    location: data.location,
  };
  const company = await API.post(`/companies/become`, companyRequest);
  await imageService.uploadCompanyPreview(logo, token);
  await imageService.uploadCompanyBackground(backgroundImage, token);
};

export const getStartsWith = async (value, page, size) => {
  return await API.get(`/companies/name/${value}?page=${page}&size=${size}`);
};

export const findAll = async (status, page, size) => {
  return await API.get(`/companies/status/${status}?page=${page}&size=${size}`);
};

export const findAllByStatus = async (page, size, status) => {
  return await API.get(`/companies/status/${status}?page=${page}&size=${size}`);
};

export const setStatus = async (id, status, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.put(`/companies/${id}/status/${status}`);
};

export const findById = async (id) => {
  return await API.get(`/companies/${id}`);
};

export const findAllByFieldAndStatus = async (data, status, page, size) => {
  return await API.get(
    `/companies/${data.optionsSelected.field}/${data.name}/status/${status}?page=${page}&size=${size}`
  );
};
