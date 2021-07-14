import API from "./api";

export const findAll = async (page, size) => {
    return await API.get(`/products?page=${page}&size=${size}`);
  };