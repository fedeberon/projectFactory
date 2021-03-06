import API from "./api";
import { signIn } from "next-auth/client";
import jwt_decode from "jwt-decode";
import * as professionalService from "./professionalService";
import * as companyService from "./companyService";

export const signInCallBack = async (user, account) => {
  const data = {
    name: user.name,
    email: user.email,
    provider: account.provider.toUpperCase(),
    accessToken: account.accessToken,
    idToken: account.idToken,
    image: user.image,
  };

  const { token } = await API.post(`/users/signInCallBack`, data);
  return token;
};
export const login = async (username, password) => {
  const credentials = {
    username,
    password,
  };

  const { token } = await API.post(`/users/login`, credentials);
  const tokenWithoutPrefix = token.split("Bearer ")[1];
  const payload = jwt_decode(tokenWithoutPrefix);
  const data = await getDataOfUserByPayload(payload, token);

  signIn("credentials", {
    accessToken: token,
    name: data.name,
    email: data.email,
    image: data.previewImage,
    callbackUrl: `${window.location.origin}/`,
  });
  return token;
};

const getDataOfUserByPayload = async (payload, token) => {
  const authorities = payload["authorities"];
  const userId = payload["jti"];
  if (authorities.includes("ROLE_PROFESSIONAL")) {
    const professional = await professionalService.getById(userId);
    return {
      name: professional.contact,
      email: professional.email,
      previewImage: professional.previewImage ? professional.previewImage : "",
    };
  } else if (authorities.includes("ROLE_COMPANY")) {
    const company = await companyService.findById(userId);
    return {
      name: company.name,
      email: company.email,
      previewImage: company.previewImage ? company.previewImage : "",
    };
  } else {
    const user = await getMe(token);
    return { name: user.username, email: user.email, previewImage: "" };
  }
};

export const getMe = async (token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(`/users/me`);
};

export const getAmountTokens = async (token) => {
  const actualTokens = localStorage.getItem("amountTokens");
  if (actualTokens == null || actualTokens == -1) {
    API.defaults.headers.common["Authorization"] = token;
    const { tokens } = await API.get(`/users/tokens`);
    localStorage.setItem("amountTokens", tokens);
    return tokens;
  } else {
    return actualTokens;
  }
};

export const isLinkedWithMercadopago = async (token) => {
  API.defaults.headers.common["Authorization"] = token;
  const isLinked = localStorage.getItem("isLinkedWithMercadopago");
  if (isLinked == null) {
    try {
      await API.get(`/users/is-linked-with-mercadopago`);
      localStorage.setItem("isLinkedWithMercadopago", true);
      return true;
    } catch (e) {
      localStorage.setItem("isLinkedWithMercadopago", false);
      return false;
    }
  } else {
    return isLinked == "true" ? true : false;
  }
};

export const clearData = () => {
  localStorage.removeItem("amountTokens");
  localStorage.removeItem("isLinkedWithMercadopago");
};

export const findAll = async (session) => {
  API.defaults.headers.common["Authorization"] = session.accessToken;
  return await API.get(`/users`);
};

export const getById = async (userId) => {
  return await API.get(`/users/${userId}`);
};

export const add = async (username, email, password) => {
  const data = {
    username,
    email,
    password,
  };
  const { token } = await API.post(`/users/register`, data);

  signIn("credentials", {
    accessToken: token,
    name: username,
    email: email,
    image: "",
    callbackUrl: `${window.location.origin}/`,
  });
  return token;
};

export const isUnique = async (email, session) => {
  API.defaults.headers.common["Authorization"] = session.accessToken;
  return await API.post(`/users/email`, { email });
};

export const loginWith2FA = async (code, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.post(`/users/2FA/login`, code);
};

export const getStartsWith = async (username, page, size, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(`/users/username/${username}?page=${page}&size=${size}`);
};

export const addAdministrator = async (user, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.post(`/users/administrator`, user);
};
