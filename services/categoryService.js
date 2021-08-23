import API from "./api";
import { categoriesActions } from "../store";

export const getCategories = async () => {
    return API.get("/categories");
};

export const create = async (category, token) => {
    API.defaults.headers.common["Authorization"] = token;
    return API.post("/categories", category);
};

export const findAllByTypeCategory = async (typeCategory) => {
    return API.get(`/categories/type-category/${typeCategory}`);
};

export const getAllByTypeCategoryAndStartsWith = async (typeCategory, name) => {
    return API.get(`/categories/type-category/${typeCategory}/name/${name}`);
};

export const dispatchCategories = async (dispatch) => {
    const productCategories = await findAllByTypeCategory("PRODUCT");
    dispatch(categoriesActions.setProducts(productCategories));
    const buildingWorkCategories = await findAllByTypeCategory("BUILDING_WORK");
    dispatch(categoriesActions.setBuildingWorks(buildingWorkCategories));
    const magazineCategories = await findAllByTypeCategory("MAGAZINE");
    dispatch(categoriesActions.setMagazines(magazineCategories));
    const companyCategories = await findAllByTypeCategory("COMPANY");
    dispatch(categoriesActions.setCompanies(companyCategories));
    dispatch(categoriesActions.setInitializated(true));
};