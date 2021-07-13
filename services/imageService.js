import image from "next/image";
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
    concatenatedTags = `${concatenatedTags}tags=${tag.tag}&`;
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

export const getProfessionalImagesByTagsLessFuntions = async (tags, page, size, token) => {
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
  API.defaults.headers.common["Authorization"] = token;
  const images = await API.get(
    `/images/building-works/${id}?page=${page}&size=${size}`
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

export const findCarouselImages = async () => {
  return await API.get(`/images/carousel`);
};

export const changeStateImagesByProfessionalId = async (
  professionalId,
  approved,
  token
) => {
  API.defaults.headers.common["Authorization"] = token;
  await API.put(`/images/professionals/${professionalId}/approved/${approved}`);
};

export const setLikePhoto = async (image, token) => {
  API.defaults.headers.common["Authorization"] = token;
  await API.put(`/images/${image.id}/like/${image.liked}`);
};

export const getLikePhotos = async (page, size, token) => {
  API.defaults.headers.common["Authorization"] = token;
  let images = await API.get(`/images/liked?page=${page}&size=${size}`);
  return images;
};

export const addPreviewImageToBuildingWork = async (data, token) => {
  API.defaults.headers.common["Authorization"] = token;
  const imageData = new FormData();
  imageData.append("image", data.previewImage);
  return await API.post(`/images/building-works/${data.id}/preview`, imageData);
};

export const getPreviewImageToBuildingWork = async (id) => {
  return await API.get(`/images/building-works/${id}/preview`);
}

export const addImagesToBuildingWork = async (data, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await addImagesRecursive(data.id, Array.from(data.images));
};

const addImage = async (id, image) => {
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

const addImagesRecursive = async (id, images) => {
  const image = images.shift();
  const response = await addImage(id, image);
  if (response && images.length > 0) {
    return await addImagesRecursive(id, images);
  }
  return response;
};
