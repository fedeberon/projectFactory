import API from "./api";

export const getAll = async (page, size, session) => {
  API.defaults.headers.common["Authorization"] = session.accessToken;
  return await API.get(`/professionals?page=${page}&size=${size}`);
};

export const getById = async (id, session) => {
  API.defaults.headers.common["Authorization"] = session.accessToken;
  return await API.get(`/professionals/${id}`);
};