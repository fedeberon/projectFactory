import API from "./api";

export const findAll = async (page, size, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(`/building-works?page=${page}&size=${size}`);
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

export const getById = async (id, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(`/building-works/${id}`);
};

export const addFolder = async (data, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.post(`/building-works`, data);
};
