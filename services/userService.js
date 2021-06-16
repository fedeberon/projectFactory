import API from "./api";

export const signInCallBack = async (user, account, profile) => {
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
  const data = {
    username,
    password,
  };
  
  const { token } = await API.post(`/users/login`, data);
  return token;
};

export const findAll = async (session) => {
  API.defaults.headers.common["Authorization"] = session.accessToken;
  return await API.get(`/users`);
};

export const getById = async (userId) => {
  return await API.get(`/users/${userId}`);
};

export const add = async (username, password, session) => {
  const data = {
    username,
    password,
  };
  
  API.defaults.headers.common["Authorization"] = session.accessToken;
  const { token } = await API.post(`/users/register`, data);
  return token;
};

export const isUnique = async (email, session) => {
  API.defaults.headers.common["Authorization"] = session.accessToken;
  return await API.post(`/users/email`, { email });
};

export const loginWith2FA = async (code, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.post(`/users/2FA/login`,code);
};

export const getStartsWith = async (username, page, size, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.get(`/users/username/${username}?page=${page}&size=${size}`);
};

export const addAdministrator = async (user, token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.post(`/users/administrator`, user);
};