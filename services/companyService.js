import API from "./api";
import * as imageService from "./imageService";

export const create = async (name, logo, token) => {
    API.defaults.headers.common["Authorization"] = token;
    const companyRequest = { name };
    const company = await API.post(`/companies`, companyRequest);
    await imageService.uploadCompanyPreview(company.id, logo, token);
};
