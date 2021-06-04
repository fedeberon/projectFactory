import { createSlice } from "@reduxjs/toolkit";

const { reducer, actions } = createSlice({
  name: "errors",
  initialState: {
    items: [],
    selectedId: null,
    error: null,
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
    }
  },
});

export { actions as errorActions };
export { reducer as errorReducer };
