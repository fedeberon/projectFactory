import API from "./api";

export const getStartsWith = async (tag, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(`/tags/${tag}`);
};

export const getTags = tags => {
  const rawTags = [];
  tags.forEach(tag => {
    rawTags.push(tag.tag);
  });

  return rawTags;
};