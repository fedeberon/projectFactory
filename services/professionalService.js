import API from "./api";

export const getProfesionals = async (page, size, session) => {
  API.defaults.headers.common["Authorization"] = session.accessToken;
  return await API.get(`/professionals?page=${page}&size=${size}`);
};

export const getProfesionalById = async (id, session) => {
  API.defaults.headers.common["Authorization"] = session.accessToken;
  return await API.get(`/professionals/${id}`);
};