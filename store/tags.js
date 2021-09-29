import { createSlice } from "@reduxjs/toolkit";

const { reducer, actions } = createSlice({
  name: "tags",
  initialState: {
    initializated: false,
    projects: [],
    products: [],
    buildingWorks: [],
    selectedTags: [],
    typeTags: [],
  },
  reducers: {
    setInitializated(state, action) {
      state.initializated = action.payload;
    },
    setProducts(state, action) {
      state.products = action.payload;
    },
    setProjects(state, action) {
      state.projects = action.payload;
    },
    setBuildingWorks(state, action) {
      state.buildingWorks = action.payload;
    },
    setSelectedTags(state, action) {
      state.selectedTags = action.payload;
    },
    setSelectedTypeTags(state, action) {
      state.typeTags = action.payload;
    },
  },
});

export { actions as tagsActions };
export { reducer as tagsReducer };
