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

export const findAllByTypeTag = async (typeTag) => {
  return await API.get(`/tags/type-tag/${typeTag}`);
};

export const findAllTypeTags = async () => {
  return await API.get(`/tags/typeTags`);
};

export const addTag = async (tag, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.post(`/tags`, tag);
};

export const dispatchTags = async (dispatch) => {
  const typeTags = await findAllTypeTags();
  const tagsTypeObject = typeTags.map((tag, index) => ({
    id: index,
    name: tag,
  }));
  dispatch(tagsActions.setSelectedTypeTags(tagsTypeObject));

  const tagsProduct = await findAllByTypeTag("PRODUCT");
  dispatch(tagsActions.setProducts(tagsProduct));

  const tagsBuildingWork = await findAllByTypeTag("BUILDING_WORK");
  dispatch(tagsActions.setBuildingWorks(tagsBuildingWork));

  const tagsProject = await findAllByTypeTag("PROJECT");
  dispatch(tagsActions.setProjects(tagsProject));

  dispatch(tagsActions.setInitializated(true));
};

export const editById = async (id, data, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return API.put(`/tags/${id}`, data);
};
