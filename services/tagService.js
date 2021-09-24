import API from "./api";
import { tagsActions } from "../store";

export const getStartsWith = async (tag, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(`/tags/${tag}`);
};

export const getStartsWithTypeTag = async (tag, typeTag, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(`/tags/${tag}/type-tag/${typeTag}`);
};

export const getTags = (tags) => {
  const rawTags = [];
  tags.forEach((tag) => {
    rawTags.push(tag.name);
  });

  return rawTags;
};

export const findAll = async () => {
  return await API.get(`/tags`);
};

export const findAllTypeTags = async () => {
  return await API.get(`/tags/typeTags`);
};

export const addTag = async (tag, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.post(`/tags`, tag);
};

export const dispatchTags = async (dispatch) => {
  const tags = await findAll();
  // const typeTags = await findAllTypeTags();

  // const tagsTypeObject = typeTags.map((tag, index) => ({
  //   id: index,
  //   name: tag,
  // }));
  
  // TODO: cuando se actualize el back cambiar esto
  const tagsTypeObject = [
    {
      id: 0,
      name: "BUILDING_WORK",
    },
  ];

  dispatch(tagsActions.setBuildingWorks(tags));
  dispatch(tagsActions.setSelectedTypeTags(tagsTypeObject));
  dispatch(tagsActions.setInitializated(true));
};
