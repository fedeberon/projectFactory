import API from "./api";
import * as imageService from "../services/imageService";

export const findAll = async (page, size) => {
    return await API.get(`/products?page=${page}&size=${size}`);
  };

export const findMyProducts = async (page, size, token) => {
    console.log("page: ", page, "size", size, "token: ",token);
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
        imageService.uploadPreviewImageToProduct(response.id, previewImage, token);
    
    if (images.length > 0)
        imageService.uploadImagesToProduct(response.id, images, token);
};
