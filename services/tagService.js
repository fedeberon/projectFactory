import API from "./api";

export const getStartsWith = async (tag, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(`/tags/${tag}`);
};

export const getStartsWithTypeTag = async (tag, typeTag, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(`/tags/${tag}/type-tag/${typeTag}`);
};

export const getTags = (tags) => {
  // console.log("getTags---", tags);
  const rawTags = [];
  tags.forEach((tag) => {
    rawTags.push(tag.name);
  });

  return rawTags;
};

export const findAll = async () => {
  return await API.get(`/tags`);
};

export const addTag = async (tag, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.post(`/tags`, tag);
};
