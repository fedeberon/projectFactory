import API from "./api";
import * as imageService from "./imageService";
import { signIn } from "next-auth/client";
import { getById } from "./professionalService";

export const create = async (data, logo, backgroundImage, categories, token, userId) => {
  API.defaults.headers.common["Authorization"] = token;
  const newCategories = [];
  categories.map((category) => newCategories.push({ name: category.tag }));
  const companyRequest = {
    name: data.name,
    categories: newCategories,
    email: data.email,
    contact: data.contact,
    description: data.description,
    contactLoad: data.contactLoad,
    website: data.website,
    province: data.province,
    location: data.location,
  };
  const response = await API.post(`/companies/become`, companyRequest);
  await imageService.uploadCompanyPreview(logo, token);
  await imageService.uploadCompanyBackground(backgroundImage, token);
  const company = await findById(userId);
  signIn("credentials", {
    accessToken: response.token,
    name: data.contact,
    email: data.email,
    image: company.previewImage,
    callbackUrl: `${window.location.origin}/profile`,
  });
};

export const getStartsWith = async (value, page, size) => {
  return await API.get(`/companies/name/${value}?page=${page}&size=${size}`);
};

export const findAll = async (status, page, size) => {
  return await API.get(`/companies/status/${status}?page=${page}&size=${size}`);
};

export const setNewTokensToCompany = async (newTokens, companyId, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.put(`/companies/${companyId}/tokens/${newTokens}`);
}

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
