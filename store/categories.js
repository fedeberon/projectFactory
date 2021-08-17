import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'categories',
  initialState: {
    initializated: false,
    products: [],
    magazines: [],
    companies: [],
    buildingWorks: [],
    selectedCategories: []
  },
  reducers: {
    setInitializated(state, action) {
        state.initializated = action.payload;
    },
    setProducts(state, action) {
        state.products = action.payload;
    },
    setMagazines(state, action) {
        state.magazines = action.payload;
    },
    setCompanies(state, action) {
        state.companies = action.payload;
    },
    setBuildingWorks(state, action) {
      state.buildingWorks = action.payload;
    },
    setSelectedCategories(state, action) {
      state.selectedCategories = action.payload;
  },
  }
});

export { actions as categoriesActions };
export { reducer as categoriesReducer };
