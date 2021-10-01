import API from "./api";
import * as tagService from "./tagService";

export const getProjectImages = async (id, token, page, size) => {
  API.defaults.headers.common["Authorization"] = token;
  let images = await API.get(
    `/images/projects/${id}?page=${page}&size=${size}`
  );
  images.forEach((image) => {
    image.name = image.path;
  });
  return images;
};

export const increaseVisit = async (image) => {
  image.seen = true;
  await API.put(`/images/${image.id}/visit`);
};

export const getProjectsImagesFiltered = async (token, page, size) => {
  API.defaults.headers.common["Authorization"] = token;
  let images = await API.get(
    `/images/projects/${id}?page=${page}&size=${size}`
  );
  images.forEach((image) => {
    image.name = image.path;
  });
  return images;
};

export const addCaroucelImages = async (images, token) => {
  API.defaults.headers.common["Authorization"] = token;

  await Promise.all(
    images.map(async (image) => {
      const imageData = new FormData();
      imageData.append("image", image);
      imageData.append("title", image.title);
      imageData.append("subTitle", image.subTitle);
      imageData.append("link", image.link);
      await API.post(`/images/carousel`, imageData);
    })
  );
};

export const getProfessionalImagesByTags = async (tags, page, size, token) => {
  API.defaults.headers.common["Authorization"] = token;
  let concatenatedTags = "";
  tags.forEach((tag) => {
    concatenatedTags = `${concatenatedTags}tags=${tag.name}&`;
  });
  concatenatedTags = concatenatedTags.substring(0, concatenatedTags.length - 1);

  const images = await API.get(
    `/images/building-works/tags?page=${page}&size=${size}&${concatenatedTags}`
  );
  images.forEach((image) => {
    image.div = null;
    image.setLike = (div) => {
      image.div = div;
    };
    image.like = async (callback) => {
      image.liked = !image.liked;
      await callback(image);
    };
    image.name = image.path;
  });
  return images;
};

export const getProfessionalImagesByTagsLessFuntions = async (
  tags,
  page,
  size,
  token
) => {
  API.defaults.headers.common["Authorization"] = token;
  let concatenatedTags = "";
  tags.forEach((tag) => {
    concatenatedTags = `${concatenatedTags}tags=${tag.tag}&`;
  });
  concatenatedTags = concatenatedTags.substring(0, concatenatedTags.length - 1);

  const images = await API.get(
    `/images/building-works/tags?page=${page}&size=${size}&${concatenatedTags}`
  );
  return images;
};

export const getImagesByBuildingWorksId = async (id, page, size, token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = token;
  }
  const images = await API.get(
    `/images/building-works/${id}?page=${page}&size=${size}`
  );
  return images;
};

export const getImagesByProductId = async (id, page, size, token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = token;
  }
  const images = await API.get(
    `/images/products/${id}?page=${page}&size=${size}`
  );
  return images;
};

export const getProfessionalImages = async (id, page, size, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const images = await API.get(
    `/images/professionals/${id}?page=${page}&size=${size}`
  );
  images.forEach((image) => {
    image.name = image.path;
  });
  return images;
};

export const uploadCompanyPreview = async (image, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const imageData = new FormData();
  imageData.append("image", image);
  await API.post(`/images/companies/preview`, imageData);
};

export const uploadMagazinePreview = async (
  magazineId,
  previewImage,
  token
) => {
  API.defaults.headers.common["Authorization"] = token;
  const imageData = new FormData();
  imageData.append("image", previewImage);
  await API.post(`/images/magazines/${magazineId}/preview`, imageData);
};

/**
 * Find all local memory images in content ( blob:http://localhost... ),
 * upload them, and replace them with path to image of backend
 * @param {String} content of the magazine with all images in local memory
 * @param {Number} magazineId to upload images in that magazine
 * @param {String} token
 */
export const uploadLocalImagesFromContent = async (
  content,
  magazineId,
  token
) => {
  API.defaults.headers.common["Authorization"] = token;
  let indexOfBlob = content.indexOf("blob:");

  while (indexOfBlob != -1) {
    let actualChar = content.charAt(indexOfBlob);
    let i = 0;
    while (actualChar != '"') {
      i++;
      actualChar = content.charAt(indexOfBlob + i);
    }

    let indexOfEndBlob = indexOfBlob + i;
    let localSrc = content.substring(indexOfBlob, indexOfEndBlob);
    content =
      content.substring(0, indexOfBlob) +
      (await fromLocalSrcToSrc(localSrc, magazineId, token)) +
      content.substring(indexOfEndBlob, content.length);
    indexOfBlob = content.indexOf("blob:");
  }

  return content;
};

const fromLocalSrcToSrc = async (localSrc, magazineId, token) => {
  const image = await fetch(localSrc);
  let blob = await image.blob();
  let file = new File([blob], `${localSrc}`, {
    type: "image/jpg",
  });

  const { path } = await uploadToMagazine(file, magazineId, token);
  return path;
};

export const uploadToMagazine = async (image, magazineId, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const imageData = new FormData();
  imageData.append("image", image);
  return await API.post(`/images/magazines/${magazineId}`, imageData);
};

export const uploadCompanyBackground = async (image, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const imageData = new FormData();
  imageData.append("image", image);
  await API.post(`/images/companies/background`, imageData);
};

export const findCarouselImages = async () => {
  return await API.get(`/images/carousel`);
};
export const deleteCarouselImage = async (imageId, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.delete(`/images/carousel/${imageId}`);
};

export const changeStateImagesByProfessionalId = async (
  professionalId,
  approved,
  token
) => {
  API.defaults.headers.common["Authorization"] = token;
  await API.put(`/images/professionals/${professionalId}/approved/${approved}`);
};

export const changeStateImagesByProductIdId = async (
  professionalId,
  approved,
  token
) => {
  API.defaults.headers.common["Authorization"] = token;
  await API.put(`/images/products/${professionalId}/approved/${approved}`);
};

export const changeStateImagesByBuildingWorkId = async (
  professionalId,
  approved,
  token
) => {
  API.defaults.headers.common["Authorization"] = token;
  await API.put(`/images/building/${professionalId}/approved/${approved}`);
};

export const setLikePhoto = async (image, token) => {
  API.defaults.headers.common["Authorization"] = token;
  await API.put(`/images/${image.id}/like/${image.liked}`);
};

export const getLikePhotos = async (page, size, token) => {
  API.defaults.headers.common["Authorization"] = token;
  let { images, count } = await API.get(
    `/images/liked?page=${page}&size=${size}`
  );
  images.forEach((image) => {
    image.div = null;
    image.setLike = (div) => {
      image.div = div;
    };
    image.like = async (callback) => {
      image.liked = !image.liked;
      await callback(image);
    };
    image.name = image.path;
  });
  return images;
};

export const addPreviewImageToBuildingWork = async (data, token) => {
  API.defaults.headers.common["Authorization"] = token;
  URL.revokeObjectURL(data.previewImage);
  const imageData = new FormData();
  imageData.append("image", data.previewImage);
  return await API.post(`/images/building-works/${data.id}/preview`, imageData);
};

export const getPreviewImageToBuildingWork = async (id) => {
  return await API.get(`/images/building-works/${id}/preview`);
};

export const addImagesToBuildingWork = async (data, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await addImagesRecursive(
    data.id,
    Array.from(data.images),
    addToBuildingWork
  );
};

const addToBuildingWork = async (id, image) => {
  const imageData = new FormData();
  const tags = tagService.getTags(image.tags);
  imageData.append("image", image);
  imageData.append("tags", tags);
  return await API.post(`/images/building-works/${id}`, imageData, {
    onUploadProgress: (progressEvent) => {
      const progress = Math.round(
        (progressEvent.loaded / progressEvent.total) * 100
      );
      image.setProgress(progress);
    },
  });
};

const addToProduct = async (id, image) => {
  const tags = tagService.getTags(image.tags);
  const imageData = new FormData();
  imageData.append("image", image);
  imageData.append("tags", tags);
  return await API.post(`/images/products/${id}`, imageData, {
    onUploadProgress: (progressEvent) => {
      const progress = Math.round(
        (progressEvent.loaded / progressEvent.total) * 100
      );
      image.setProgress(progress);
    },
  });
};

const addImagesRecursive = async (id, images, callback) => {
  const image = images.shift();
  await callback(id, image);
  if (images.length > 0) {
    return await addImagesRecursive(id, images, callback);
  }
};

export const uploadPreviewImageToProduct = async (id, previewImage, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const imageData = new FormData();
  imageData.append("image", previewImage);
  await API.post(`/images/products/${id}/preview`, imageData);
};

export const uploadImagesToProduct = async (productId, images, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await addImagesRecursive(productId, images, addToProduct);
};
