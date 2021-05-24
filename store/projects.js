import { createSlice } from "@reduxjs/toolkit";

const { reducer, actions } = createSlice({
  name: "projects",
  initialState: {
    items: [],
    selectedId: null,
    project: null,
  },

  reducers: {
    store(state, action) {
      state.items = action.payload;
    },
    select(state, action) {
      state.selectedId = action.payload.id;
    },
    set(state, action) {
      state.prefessional = action.payload;
    },
    addItems(state, action) {
      const projects = action.payload;
      projects.forEach((item) => state.items.push(item));
    },
    addItem(state, action) {
      const project = action.payload;
      let found = state.items.includes(project);
      if (!found) {
        state.items.push(project);
      }
    },
  },
});

export { actions as projectActions };
export { reducer as projectReducer };
