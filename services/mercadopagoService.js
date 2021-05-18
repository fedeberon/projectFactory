import API from "./api";

export const processPayment = async (payment,token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.post(`/mercadopago/process_payment`,payment);
};