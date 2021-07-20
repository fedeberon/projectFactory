import API from "./api";
import * as imageService from "../services/imageService";

export const findAll = async (status, page, size) => {
  return await API.get(`/products/status/${status}?page=${page}&size=${size}`);
};

export const findMyProducts = async (page, size, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(`/products/my-products?page=${page}&size=${size}`);
};

export const addProduct = async (product, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const images = Array.from(product.images);
  const previewImage = product.previewImage;
  delete product.images;
  delete product.previewImage;

  const response = await API.post(`/products`, product);

  if (previewImage != undefined || previewImage != null)
    await imageService.uploadPreviewImageToProduct(
      response.id,
      previewImage,
      token
    );

  if (images.length > 0)
    await imageService.uploadImagesToProduct(response.id, images, token);

  return response;
};

export const getById = async (id) => {
  return await API.get(`/products/${id}`);
};

export const setStatus = async (id, status, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.put(`/products/${id}/status/${status}`);
};

export const findByContactAndStatus = async (contact, status, page, size) => {
  return await API.get(`/products/contact/${contact}/status/${status}?page=${page}&size=${size}`);
    API.defaults.headers.common["Authorization"] = token;
    const images = Array.from(product.images);
    const previewImage = product.previewImage;
    delete product.images;
    delete product.previewImage;
    
    const response = await API.post(`/products`, product);
    
    if (previewImage != undefined || previewImage != null)
        imageService.uploadPreviewImageToProduct(response.id, previewImage, token);
    
    if (images.length > 0)
        imageService.uploadImagesToProduct(response.id, images, token);
};

export const findAllByStatus = async (page, size, status) => {
    return await API.get(`/products/status/${status}?page=${page}&size=${size}`);
};